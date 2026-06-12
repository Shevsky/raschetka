import { Prisma, prisma } from '~/app/prisma';
import { mqService } from '~/app/services/mq.service';
import { EnvelopeType, wrapEnvelope } from '~/app/usecases/envelope-codec.usecase';
import { lookupEmojis } from '~/app/usecases/lookup-emojis.usecase';
import { normalizeCheckItems } from '~/app/usecases/normalize-check-items.usecase';
import {
  CheckGroupModel,
  CheckModel,
  CheckSentCommunicationModel,
  CheckStatus,
  ExternalAccountProvider,
  FiscalReceiptRaw
} from '~/persistence';
import { InvalidArgumentError } from '~/utils/errors/invalid-argument.error';
import { sumBy } from '~/utils/misc/sum-by';

class CheckService {
  /** Получить данные по чеку */
  async getCheck(id: string, and?: Array<Prisma.CheckWhereInput>): Promise<CheckModel> {
    return prisma.check.findUniqueOrThrow({
      where: { id, OR: and },
      include: {
        user: { include: { accounts: true } },
        items: { include: { participant: { include: { user: true } }, group: true }, orderBy: { index: 'asc' } },
        itemGroups: { include: { participants: { include: { user: true } }, items: true } },
        participants: { include: { user: { include: { accounts: true } }, items: true, itemGroups: { include: { items: true } } } }
      }
    });
  }

  /** Получить данные по чеку, но только если есть доступ у указанного юзера */
  async getCheckIfAvailable(id: string, userId: string): Promise<CheckModel> {
    return this.getCheck(id, [{ userId }, { participants: { some: { userId } } }]);
  }

  /** Получить количество чеков пользователя */
  async countChecksByUserId(userId: string): Promise<[countCreated: number, countAssigned: number]> {
    return prisma.$transaction([
      prisma.check.count({
        where: { userId, status: { in: [CheckStatus.ACTIVE, CheckStatus.COMPLETED] } }
      }),
      prisma.check.count({
        where: {
          participants: { some: { userId } },
          status: { in: [CheckStatus.ACTIVE, CheckStatus.COMPLETED] }
        }
      })
    ]);
  }

  /** Найти чеки пользователя (созданные им) */
  async getChecksByUserId(userId: string, statuses: Array<CheckStatus>, take?: number, skip?: number): Promise<Array<CheckModel>> {
    return prisma.check.findMany({
      where: { userId, status: { in: statuses } },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    });
  }

  /** Найти чеки пользователя (в которых он есть как участник) */
  async getChecksByParticipantUserId(
    userId: string,
    statuses: Array<CheckStatus>,
    take?: number,
    skip?: number
  ): Promise<Array<CheckModel>> {
    return prisma.check.findMany({
      where: {
        participants: { some: { userId } },
        status: { in: statuses }
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    });
  }

  /** Найти чеки, завершенные после */
  async getChecksCompletedBefore(cutoff: Date): Promise<Array<CheckModel>> {
    return prisma.check.findMany({
      where: {
        status: CheckStatus.COMPLETED,
        completedAt: { lt: cutoff }
      }
    });
  }

  /** Связывает чек с отправленной коммуникацией */
  async setCheckSentCommunication(id: string, provider: ExternalAccountProvider, messageId: string, chatId?: string): Promise<void> {
    await prisma.check.update({
      where: { id },
      data: {
        sentCommunication: {
          upsert: {
            create: { provider, messageId, chatId },
            update: { provider, messageId, chatId }
          }
        }
      }
    });
  }

  /** Найти параметры отправленной коммуникации по чеку */
  async getCheckSentCommunication(id: string, provider: ExternalAccountProvider): Promise<Nullish<CheckSentCommunicationModel>> {
    return prisma.checkSentCommunication.findUnique({
      where: { checkId: id, provider }
    });
  }

  /** Удалить чек из базы, но только в состоянии драфта */
  async deleteDraftCheck(id: string): Promise<void> {
    await prisma.check.delete({
      where: { id, status: CheckStatus.DRAFT }
    });
  }

  /** Закрыть указанный чек, но только в состоянии активного */
  async completeCheckIfAuthor(id: string, userId: string): Promise<void> {
    await prisma.check.update({
      where: { id, userId, status: CheckStatus.ACTIVE },
      data: { status: CheckStatus.COMPLETED }
    });
  }

  /** Перенести выбранные чеки в архив */
  async archiveChecks(ids: Array<string>): Promise<void> {
    await prisma.check.updateMany({
      where: { id: { in: ids } },
      data: { status: CheckStatus.ARCHIVE }
    });
  }

  /** Получить группу чеков по айди этой группы */
  async getCheckGroup(id: string): Promise<CheckGroupModel> {
    return prisma.checkGroup.findUniqueOrThrow({
      where: { id },
      include: { checks: true }
    });
  }

  /** Создать группу чеков для указанных айдишников */
  async createCheckGroup(ids: Array<string>): Promise<CheckGroupModel> {
    return prisma.checkGroup.create({
      data: {
        checks: { connect: ids.map((id) => ({ id })) }
      },
      include: { checks: true }
    });
  }

  /** Удаляет группу чеков, и все чеки в ней тоже */
  async deleteCheckGroup(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const group: CheckGroupModel = await tx.checkGroup.findUniqueOrThrow({
        where: { id },
        include: { checks: true }
      });

      // Сначала удаляем все чеки, что в состоянии драфта
      for (const check of group.checks!) {
        await tx.check.delete({
          where: { id: check.id, status: CheckStatus.DRAFT }
        });
      }

      // Затем саму группу
      await tx.checkGroup.delete({
        where: { id }
      });
    });
  }

  /** Создаёт чек по данным фискального документа */
  async createCheckFromReceipt(
    userId: string,
    receipt: FiscalReceiptRaw,
    groupId?: string
  ): Promise<[check: CheckModel, isDuplicate: boolean]> {
    const fiscalDocumentNumber = String(receipt.fiscalDocumentNumber).trim();
    const fiscalDriveNumber = String(receipt.fiscalDriveNumber).trim();
    const fiscalSign = String(receipt.fiscalSign).trim();
    const kktRegId = String(receipt.kktRegId).trim();
    const transactionAt = new Date(receipt.dateTime);

    const emojis = await lookupEmojis(receipt.items.map((item) => item.name));

    return prisma.$transaction(async (tx) => {
      const existingCheck = await tx.check.findUnique({
        where: {
          fiscal: {
            userId,
            fiscalDocumentNumber,
            fiscalDriveNumber,
            fiscalSign,
            kktRegId
          }
        },
        include: { items: true }
      });

      if (existingCheck) {
        return [existingCheck, true];
      } else {
        const check = await tx.check.create({
          data: {
            userId,
            groupId,
            fiscalDocumentNumber,
            fiscalDriveNumber,
            fiscalSign,
            kktRegId,
            transactionAt,
            tipsSum: 0,
            itemsSum: receipt.totalSum,
            totalSum: receipt.totalSum,
            companyName: receipt.user,
            companyTaxCode: receipt.userInn,
            retailPlaceName: receipt.retailPlace,
            retailPlaceAddress: receipt.retailPlaceAddress,
            items: {
              create: normalizeCheckItems(
                receipt.items.map((item, index) => ({
                  index,
                  name: item.name,
                  emoji: emojis[index],
                  price: item.price,
                  quantity: item.quantity,
                  sum: item.sum
                }))
              )
            }
          }
        });

        return [check, false];
      }
    });
  }

  /** Объединяет группу чеков в один единственный чек, а всю группу удаляет к хуям */
  async createCheckFromGroup(id: string): Promise<CheckModel> {
    return prisma.$transaction(async (tx) => {
      const group: CheckGroupModel = await tx.checkGroup.findUniqueOrThrow({
        where: { id },
        include: { checks: true }
      });

      if (group.checks!.length === 0) {
        throw new InvalidArgumentError(`Нельзя создать чек из пустой группы (id=${id})`);
      }

      if (group.checks!.length === 1) {
        throw new InvalidArgumentError(`Нельзя создать чек из группы (id=${id}) с одним чеком внутри`);
      }

      // Сначала удаляем все чеки, что в состоянии драфта
      for (const check of group.checks!) {
        await tx.check.delete({
          where: { id: check.id, status: CheckStatus.DRAFT }
        });
      }

      // Грохаем группу
      await tx.checkGroup.delete({
        where: { id }
      });

      const [firstCheck] = group.checks!;

      // И создаём новый чек, в котором будут объединены все из группы
      return tx.check.create({
        data: {
          userId: firstCheck.userId,
          fiscalDocumentNumber: firstCheck.fiscalDocumentNumber,
          fiscalDriveNumber: firstCheck.fiscalDriveNumber,
          fiscalSign: firstCheck.fiscalSign,
          kktRegId: firstCheck.kktRegId,
          transactionAt: new Date(firstCheck.transactionAt),
          tipsSum: sumBy(group.checks!, 'tipsSum'),
          itemsSum: sumBy(group.checks!, 'itemsSum'),
          totalSum: sumBy(group.checks!, 'totalSum'),
          companyName: firstCheck.companyName,
          companyTaxCode: firstCheck.companyTaxCode,
          retailPlaceName: firstCheck.retailPlaceName,
          retailPlaceAddress: firstCheck.companyName,
          items: {
            create: normalizeCheckItems(
              group
                .checks!.flatMap((check) =>
                  check.items!.map((item) => ({
                    name: item.name,
                    emoji: item.emoji,
                    price: item.price,
                    quantity: item.quantity,
                    sum: item.sum
                  }))
                )
                .map((check, index) => ({
                  ...check,
                  index
                }))
            )
          },
          parentChecksCount: group.checks!.length
        }
      });
    });
  }

  /** Публикация чека (перевод из драфта в активный) */
  async fillCheck(
    id: string,
    userId: string,
    title: string,
    comment: string,
    tipsSum: number,
    userIdsAsParticipants: Array<string>,
    itemGroups: Array<{ name: string; itemIds: Array<string>; userIds: Array<string> }>,
    lobbyId?: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Обновляем базовые параметры чека
      await tx.check.update({
        // Если автор чека не указанный пользователь, то тогда тут выкинется ошибка и дальше мы не пойдём
        where: { id, userId, status: CheckStatus.DRAFT },
        data: { title, comment, tipsSum, totalSum: { increment: tipsSum }, status: CheckStatus.ACTIVE }
      });

      // Создаём участников чека, тут будет мапа (id юзера к сущности participant)
      const participants = Object.fromEntries(
        await Promise.all(
          userIdsAsParticipants.map(
            async (userIdAsParticipant) =>
              [
                userIdAsParticipant,
                await tx.checkParticipant.create({
                  data: { checkId: id, userId: userIdAsParticipant }
                })
              ] as const
          )
        )
      );

      // Сортируем участников чека, чтоб потом правильно составить пары друзей
      userIdsAsParticipants.sort();
      // Всех участников чека нужно подружить, проще всего это сделать через createMany
      await tx.friendship.createMany({
        data: userIdsAsParticipants.flatMap((a, i) => userIdsAsParticipants.slice(i + 1).map((b) => ({ fromUserId: a, toUserId: b }))),
        skipDuplicates: true
      });

      // Создаём в конце концов группы айтемов
      for (const itemGroup of itemGroups) {
        await tx.checkItemGroup.create({
          data: {
            checkId: id,
            name: itemGroup.name,
            items: { connect: itemGroup.itemIds.map((itemId) => ({ id: itemId })) },
            participants: { connect: itemGroup.userIds.map((userIdForGroup) => ({ id: participants[userIdForGroup].id })) }
          }
        });
      }

      // Если был указан лобби расчёта, то закрываем его
      if (lobbyId) {
        await tx.lobby.update({
          where: { id: lobbyId },
          data: { checkId: id }
        });
      }

      // Вытаскиваем ранее отправленную коммуникацию (в целом она может и отсутствовать)
      const sentCommunication = await tx.checkSentCommunication.findUnique({
        where: { checkId: id }
      });

      await mqService.queueMessage(tx, userId, wrapEnvelope({ type: EnvelopeType.CHECK_CREATED, payload: { id } }), {
        // Если коммуникация уже была отправлена, то мы подменим её, а иначе просто отправим новое сообщение
        provider: sentCommunication?.provider,
        messageId: sentCommunication?.messageId,
        chatId: sentCommunication?.chatId
      });

      for (const userIdAsParticipant of userIdsAsParticipants) {
        // Посылаем пушик всем зарегистрированным участникам тоже, НО кроме автора чека (ему итак придет сообщение выше)
        if (userIdAsParticipant !== userId) {
          await mqService.queueMessage(tx, userIdAsParticipant, wrapEnvelope({ type: EnvelopeType.CHECK_ASSIGNED, payload: { id } }));
        }
      }
    });
  }

  /** Заполнение чека (выбор своих товаров и... всё) */
  async pickCheckItems(id: string, userId: string, itemIds: Array<string>): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const check = await tx.check.findUniqueOrThrow({
        where: { id },
        include: { items: true }
      });

      // Ищем товары, которые стали недоступны (уже кто-то забрал на себя)
      const unavailableItems = check.items.filter((item) => itemIds.includes(item.id)).filter((item) => !!item.participantId);

      if (unavailableItems.length) {
        throw new InvalidArgumentError(
          `Некоторые товары кто-то уже успел забрать на себя: ${unavailableItems.map((item) => `«${item.name}»`).join(', ')}`,
          { meta: unavailableItems.map((item) => item.id) }
        );
      }

      // Находим участника по userId (чтоб в следующем апдейте использовать конкретный id)
      const participant = await tx.checkParticipant.findUniqueOrThrow({
        where: { single: { checkId: id, userId } }
      });

      // Назначаем товары на участника
      await tx.checkParticipant.update({
        where: { id: participant.id },
        data: {
          // Ставим флаг, что чек этим участником заполнен
          filled: true,
          items: {
            connect: itemIds.map((itemId) => ({
              id: itemId,
              // Вот это ⬇️ значит что связь мы создадим только с товаром у которого ещё никого не назначено, либо тут возникнет ошибка
              // Но в целом сюда мы и не должны дойти, так как выше уже перепроверили товары
              participantId: null
            }))
          }
        }
      });

      // Должны перевести в COMPLETED если не осталось неназначенных товаров
      const shouldComplete = !check.items
        .filter((item) => !item.groupId && !item.participantId)
        .filter((item) => !itemIds.includes(item.id)).length;

      // Переводим чек в COMPLETED
      if (shouldComplete) {
        await tx.check.update({
          where: { id },
          data: { status: CheckStatus.COMPLETED, completedAt: new Date() }
        });
      }

      // В конце концов, отправляем коммуникации
      const authorId = check.userId;
      const participantId = participant.id;

      if (userId !== authorId) {
        // Юзеру отправляем сообщение, что он молодец и заполнил чек
        await mqService.queueMessage(tx, userId, wrapEnvelope({ type: EnvelopeType.CHECK_FILLED, payload: { id, participantId } }));
      }

      // Автору чека тоже отправляем сообщение
      await mqService.queueMessage(tx, authorId, wrapEnvelope({ type: EnvelopeType.CHECK_FILLED, payload: { id, participantId } }));
    });
  }
}

export const checkService = new CheckService();

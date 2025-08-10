import { match } from 'ts-pattern';
import { cancelCheckGroupQuery, cancelCheckQuery, doneCheckGroupQuery, startCheckGroupQuery } from '~/app/bot/config/queries.config';
import { checkScenario } from '~/app/bot/config/scenarios.config';
import { checkGroupWf } from '~/app/bot/config/workflows.config';
import {
  getCheckDraftCreatedFromGroupMessage,
  getCheckDraftCreatedMessage,
  getCheckDuplicateReceivedWhenGroupMessage,
  getCheckGroupCreatedMessage,
  getCheckNextDraftCreatedWhenGroupMessage
} from '~/app/bot/core/messages/checks.messages';
import {
  getNotAFiscalQRErrorMessage,
  getNotAJSONErrorMessage,
  getNotAReceiptJSONErrorMessage,
  getQRNotFoundErrorMessage,
  getUnknownMimeTypeErrorMessage
} from '~/app/bot/core/messages/errors.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { TypedMessage } from '~/app/bot/types/message';
import { checkService } from '~/app/services/check.service';
import { getReceiptFromJSONData, ReceiptFromJSONDataErrorCode } from '~/app/usecases/get-receipt-from-json-data.usecase';
import { getReceiptFromQRFile, ReceiptFromQRFileErrorCode } from '~/app/usecases/get-receipt-from-qr-file.usecase';
import { CheckGroupModel, ExternalAccountProvider, FiscalReceiptRaw, Permission } from '~/persistence';
import { successReactions } from '~/utils/dicts/reactions.dict';
import { canceledResults } from '~/utils/dicts/results.dict';
import { choice } from '~/utils/misc/choice';
import { Left } from '~/utils/misc/either';
import { noop } from '~/utils/misc/noop';
import { raise } from '~/utils/misc/raise';

/**
 * 👯‍♀️ Основной сценарий использования бота — обработка json и фоток фискальных чеков
 * 1. Реагирует на отправку файлов (чтобы обрабатывать json);
 * 2. Реагирует на отправку фото (чтобы вытаскивать json по QR коду);
 */
export function registerChecksScenario(bot: TypedBot) {
  // ⬇️ Главный обработчик сценария: реагирует на отправленные файлы и фотографии
  bot.on(['message:document', 'message:photo'], async (ctx, next) => {
    // Запоминаем юзера, он нам понадобится дальше
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.CREATE_CHECKS)) {
      console.info(`🙅‍♀️ ${user.name} (id=${user.id}) попытался что-то нам послать, но мы это проигнорировали`);

      // Если нет прав на создание чеков, то дальше не идём
      return next();
    }

    // Должны будем распарсить фискальник, ну либо упасть в ошибку
    let receipt: FiscalReceiptRaw;
    let group: Nullish<CheckGroupModel> = null;

    // Чтоб видели прогресс посылаем событие "печатает..."
    await ctx.replyWithChatAction('typing');

    if (ctx.isWorkflowActive(checkGroupWf)) {
      // Если мы в режиме группировки, то вытянем активную группу
      const [id] = ctx.matchWorkflow(checkGroupWf);
      group = await checkService.getCheckGroup(id);
    }

    if (ctx.update.message.document) {
      console.info(`📨 ${user.name} (id=${user.id}) прислал нам какой-то файл`);

      // Если отправили документ, то сохраним его
      const document = ctx.update.message.document;

      if (!document.file_name?.endsWith('json')) {
        // Если отправили не json, сразу выкидываем ответ с ошибкой

        const mimeType = String(document.mime_type);

        console.info(`🙅‍♀️ Файл от ${user.name} (id=${user.id}) нам не подходит (${mimeType})`);

        return ctx.reply(...getUnknownMimeTypeErrorMessage(mimeType));
      }

      // Скачиваем файл как json и создаём чек
      const data = await ctx.downloadFile(document, 'json');
      const out = getReceiptFromJSONData(data);

      if (out instanceof Left) {
        return ctx.reply(
          ...match(out.error.code)
            .with(ReceiptFromJSONDataErrorCode.NOT_A_JSON, () => getNotAJSONErrorMessage())
            .with(ReceiptFromJSONDataErrorCode.NOT_A_RECEIPT_JSON, () => getNotAReceiptJSONErrorMessage())
            .exhaustive()
        );
      } else {
        receipt = out.value;
      }
    } else if (ctx.update.message.photo) {
      console.info(`📨 ${user.name} (id=${user.id}) прислал нам фотографию, надеюсь, что это QR код`);

      // Вытаскиваем фотку (в самом лучшем качестве будет последняя в массиве)
      const photo = ctx.update.message.photo.at(-1)!;

      // Скачиваем файл и создаём из него чек
      const buffer = await ctx.downloadFile(photo, 'arrayBuffer');
      const out = await getReceiptFromQRFile(buffer);

      if (out instanceof Left) {
        console.info(`🙅‍♀️ Фотография от ${user.name} (id=${user.id}) какая-то не такая (${out.error.code})`);

        return ctx.reply(
          ...match(out.error.code)
            .with(ReceiptFromQRFileErrorCode.QR_NOT_FOUND, () => getQRNotFoundErrorMessage())
            .with(ReceiptFromQRFileErrorCode.NOT_A_FISCAL_QR, () => getNotAFiscalQRErrorMessage())
            .otherwise(() => raise(out.error))
        );
      } else {
        receipt = out.value;
      }
    } else {
      console.info(`🙅‍♀️ ${user.name} прислал нам совсем какую-то непонятную дичь...`);

      return next();
    }

    // Создаём пустой чек из фискальника, что распарсили ранее
    const [check, isDuplicate] = await checkService.createCheckFromReceipt(user.id, receipt, group?.id);

    console.info(
      `✅ То, что нам прилетело от ${user.name} (id=${user.id}), было сохранено как чек (id=${check.id}, isDuplicate=${isDuplicate})`
    );

    let message: TypedMessage;

    if (isDuplicate) {
      // Если этот чек уже был отправлен ранее, то поведение зависит от того, активен ли режим группировки

      if (group) {
        // Режим группировки включается ненадолго, поэтому просто пишем о том, что это дубль и ничего не делаем
        message = getCheckDuplicateReceivedWhenGroupMessage(group);
      } else {
        // А в обычном режиме вытащим отправленную ранее коммуникацию по этому чеку, удалим кнопки оттуда, и только потом отправим новую
        const sentCommunication = await checkService.getCheckSentCommunication(check.id, ExternalAccountProvider.TELEGRAM);
        if (sentCommunication && sentCommunication.chatId) {
          // Оборачиваем в промис и глушим ошибки, потому что есть ограничение, что нельзя редачить сообщения если прошло > 48 часов
          await Promise.try(() =>
            ctx.api.editMessageReplyMarkup(sentCommunication.chatId!, Number(sentCommunication.messageId), { reply_markup: undefined })
          ).catch(noop);
        }

        message = getCheckDraftCreatedMessage(check, true);
      }
    } else {
      // Иначе отправляем обычные сообщения
      message = group ? getCheckNextDraftCreatedWhenGroupMessage(check, group) : getCheckDraftCreatedMessage(check, false);
    }

    // Пуляем сообщение, что мы всё сделали
    const reply = await ctx.replyDuringScenario(checkScenario, ...message);
    await checkService.setCheckSentCommunication(check.id, ExternalAccountProvider.TELEGRAM, String(reply.message_id), String(ctx.chatId));
  });

  // ⬇️ Обработчик на кнопку отмены создания чека (одиночного, не в группе)
  bot.callbackQuery(cancelCheckQuery.regex, async (ctx) => {
    // Здесь будет айдишник чека
    const [, id] = ctx.match;

    await ctx.answerCallbackQuery(choice(successReactions));
    await ctx.flushScenario(checkScenario);

    // Удаляем созданный чек
    await checkService.deleteDraftCheck(id);

    await ctx.reply(choice(canceledResults));
  });

  // ⬇️ Обработчик на кнопку начала группировки чеков
  bot.callbackQuery(startCheckGroupQuery.regex, async (ctx) => {
    // Здесь будет айдишник чека
    const [, id] = ctx.match;

    await ctx.answerCallbackQuery();

    // Создаём группу
    const group = await checkService.createCheckGroup([id]);

    // Пуляем сообщение, что можно вкидывать следующие чеки
    await ctx.replyDuringScenario(checkScenario, ...getCheckGroupCreatedMessage(group));

    ctx.enterWorkflow(checkGroupWf, group.id);
  });

  // ⬇️ Обработчик на кнопку отмены создания чеков в режиме группировки
  bot.callbackQuery(cancelCheckGroupQuery.regex, async (ctx) => {
    // Здесь будет айдишник группы
    const [, id] = ctx.match;

    ctx.exitWorkflow(checkGroupWf);

    await ctx.answerCallbackQuery(choice(successReactions));
    await ctx.flushScenario(checkScenario);

    // Удаляем группу чеков, вместе с ней удалятся и сами чеки
    await checkService.deleteCheckGroup(id);

    await ctx.reply(choice(canceledResults));
  });

  // ⬇️ Обработчик на кнопку завершения группировки чеков
  bot.callbackQuery(doneCheckGroupQuery.regex, async (ctx) => {
    // Здесь будет айдишник группы
    const [, id] = ctx.match;

    ctx.exitWorkflow(checkGroupWf);

    await ctx.answerCallbackQuery();
    await ctx.flushScenario(checkScenario);

    // Объединяем все чеки в группе в один единственный чек
    const check = await checkService.createCheckFromGroup(id);

    await ctx.reply(...getCheckDraftCreatedFromGroupMessage(check));
  });
}

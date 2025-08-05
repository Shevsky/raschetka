import { match } from 'ts-pattern';
import { bot } from '~/app/bot/core/bot';
import { getCheckAssignedMessage, getCheckCreatedMessage, getCheckFilledMessage } from '~/app/bot/core/messages/checks.messages';
import { getInviteToUserAcceptedMessage } from '~/app/bot/core/messages/users.messages';
import { findTelegramAccount } from '~/app/bot/utils/find-telegram-account';
import { checkService } from '~/app/services/check.service';
import { mqService } from '~/app/services/mq.service';
import { userService } from '~/app/services/user.service';
import { Envelope, EnvelopeType, unwrapEnvelope } from '~/app/usecases/envelope-codec.usecase';
import { ExternalAccountProvider, UserModel } from '~/persistence';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { chill } from '~/utils/misc/chill';
import { exhaustiveCheck } from '~/utils/misc/exhaustive-check';

const retryDelayMs = 5_000;
const pollIntervalMs = 5_000;

class BotMQWorker {
  async start(): Promise<void> {
    while (true) {
      try {
        console.info('✅ Очередь сообщений для бота запущена');

        await this.#start();

        break;
      } catch (error) {
        console.error(error);
        console.info(`⏳ Попробуем снова через ${retryDelayMs} мс`);

        await chill(retryDelayMs);
      }
    }
  }

  async #start(): Promise<void> {
    const stream = mqService.streamQueuedMessages(ExternalAccountProvider.TELEGRAM, pollIntervalMs);

    for await (const message of stream) {
      const envelope = unwrapEnvelope(message.data);

      // Отправляем сообщение
      await this.#send(message.recipient!, envelope, message.messageId, message.chatId);

      // Помечаем, что оно отправлено
      await mqService.setMessageSent(message.id);

      console.info(`💬 Отправили сообщение для ${message.recipient!.name} (id=${message.recipient!.id})`);
    }
  }

  async #send(recipient: UserModel, envelope: Envelope, messageId?: Nullish<string>, chatId?: Nullish<string>): Promise<void> {
    const telegramAccount = findTelegramAccount(recipient);

    if (!telegramAccount) {
      throw new RuntimeError(`Отправить сообщение для ${recipient.name} (id=${recipient.id}) не удалось: не нашли аккаунт Telegram`);
    }

    if (!chatId) {
      chatId = telegramAccount.providerId;
    }

    const message = await match(envelope)
      .with({ type: EnvelopeType.USER_INVITE_ACCEPTED }, async ({ payload }) => {
        const user = await userService.getUser(payload.id, true);

        return getInviteToUserAcceptedMessage(user);
      })
      .with({ type: EnvelopeType.CHECK_CREATED }, { type: EnvelopeType.CHECK_ASSIGNED }, async ({ type, payload }) => {
        const check = await checkService.getCheck(payload.id);

        switch (type) {
          case EnvelopeType.CHECK_CREATED: {
            return getCheckCreatedMessage(check);
          }
          case EnvelopeType.CHECK_ASSIGNED: {
            return getCheckAssignedMessage(check);
          }
          default: {
            return exhaustiveCheck(type);
          }
        }
      })
      .with({ type: EnvelopeType.CHECK_FILLED }, async ({ payload }) => {
        const check = await checkService.getCheck(payload.id);
        const participant = check.participants!.find((iterableParticipant) => iterableParticipant.id === payload.participantId)!;

        return getCheckFilledMessage(check, recipient, participant);
      })
      .exhaustive();

    const fallback = () => bot.api.sendMessage(chatId, ...message);

    if (messageId) {
      // Если сообщение было давно, то тут будет ошибка, но наше-то сообщение всё равно ведь нужно отправить, поэтому по ошибке обычный send
      await Promise.try(() => bot.api.editMessageText(chatId, Number(messageId), ...message)).catch(() => fallback());
    } else {
      // Если не нужно было заменять сообщение, то обычный send
      await fallback();
    }
  }
}

export const botMQWorker = new BotMQWorker();

import { Prisma, prisma } from '~/app/prisma';
import { ExternalAccountProvider, QueuedMessageModel } from '~/persistence';
import { chill } from '~/utils/misc/chill';

class MQService {
  /** Положить сообщение в очередь на отправку */
  async queueMessage(
    client: Prisma.TransactionClient,
    recipientId: string,
    data: string,
    options?: {
      provider?: ExternalAccountProvider;
      messageId?: Nullish<string>;
      chatId?: Nullish<string>;
    }
  ): Promise<void> {
    await client.queuedMessage.create({
      data: {
        recipientId,
        data,
        provider: options?.provider,
        messageId: options?.messageId,
        chatId: options?.chatId
      }
    });
  }

  /** Создаёт поток с очередью сообщений для всех юзеров у которых подключён указанный провайдер */
  async *streamQueuedMessages(provider: ExternalAccountProvider, pollIntervalMs: number = 1000): AsyncGenerator<QueuedMessageModel> {
    while (true) {
      const messages = await prisma.queuedMessage.findMany({
        where: {
          sentAt: null,
          recipient: { accounts: { some: { provider } } }
        },
        include: {
          recipient: { include: { accounts: true } }
        }
      });

      for (const message of messages) {
        yield message;
      }

      await chill(pollIntervalMs);
    }
  }

  /** Помечает что сообщение было отправлено */
  async setMessageSent(id: number): Promise<void> {
    await prisma.queuedMessage.update({
      where: { id },
      data: { sentAt: new Date() }
    });
  }
}

export const mqService = new MQService();

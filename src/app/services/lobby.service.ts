import { prisma, Prisma } from '~/app/prisma';
import { LobbyModel } from '~/persistence';

class LobbyService {
  /** Получить данные по комнате */
  async getLobby(id: string, and?: Array<Prisma.LobbyWhereInput>): Promise<LobbyModel> {
    return prisma.lobby.findUniqueOrThrow({
      where: { id, OR: and },
      include: { user: true, check: true, participants: { include: { user: true } } }
    });
  }

  /** Получить данные по комнате, но только если есть доступ у указанного юзера */
  async getLobbyIfAvailable(id: string, userId: string): Promise<LobbyModel> {
    return this.getLobby(id, [{ userId }, { participants: { some: { userId } } }]);
  }

  /** Найти открытую комнату ожидания пользователя */
  async getOpenedLobbyByUserId(userId: string): Promise<Nullish<LobbyModel>> {
    return prisma.lobby.findFirst({
      where: { userId, closed: false }
    });
  }

  /** Присоединиться к комнате */
  async joinToLobby(userId: string, lobbyId: string): Promise<void> {
    await prisma.lobbyParticipant.upsert({
      where: {
        single: { userId, lobbyId }
      },
      create: { userId, lobbyId },
      update: {}
    });
  }

  /** Создаёт комнату ожидания для сбора людей */
  async createLobby(userId: string, userIdsAsParticipants: Array<string>, shouldClosePrevious: boolean = false): Promise<LobbyModel> {
    return prisma.$transaction(async (tx) => {
      if (shouldClosePrevious) {
        await tx.lobby.updateMany({
          where: { userId, closed: false },
          data: { closed: true }
        });
      }

      const lobby = await tx.lobby.create({
        data: {
          userId
        }
      });

      await Promise.all(
        [userId, ...userIdsAsParticipants].map((userIdAsParticipant) =>
          tx.lobbyParticipant.create({
            data: { lobbyId: lobby.id, userId: userIdAsParticipant }
          })
        )
      );

      return lobby;
    });
  }
}

export const lobbyService = new LobbyService();

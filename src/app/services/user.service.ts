import { prisma } from '~/app/prisma';
import { mqService } from '~/app/services/mq.service';
import { EnvelopeType, wrapEnvelope } from '~/app/usecases/envelope-codec.usecase';
import { ExternalAccountProvider, Gender, Permission, UserModel } from '~/persistence';
import { toggle } from '~/utils/misc/toggle';

class UserService {
  /** Получить пользователя по его айди */
  async getUser(id: string, extended: boolean = false): Promise<UserModel> {
    return prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        accounts: true,
        inviter: extended ? { include: { accounts: true } } : false
      }
    });
  }

  /** Получить пользователя по id внешнего провайдера */
  async getUserByExternalAccount(provider: ExternalAccountProvider, providerId: string): Promise<UserModel> {
    return prisma.user.findFirstOrThrow({
      where: { accounts: { some: { provider, providerId } } },
      include: { accounts: true }
    });
  }

  /** Получить список последних зарегистрированных пользователей */
  async getLatestUsers(take?: number, skip?: number): Promise<Array<UserModel>> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { accounts: true },
      take,
      skip
    });
  }

  /** Создать пользователя по данным из внешнего провайдера */
  async createExternalProvidedUser(
    provider: ExternalAccountProvider,
    providerId: string,
    login: Nullish<string>,
    firstName: Nullish<string>,
    secondName: Nullish<string>,
    lastName: Nullish<string>,
    gender: Nullish<Gender>,
    mention: Nullish<string>,
    userpic: Nullish<string>
  ): Promise<UserModel> {
    return prisma.user.create({
      data: {
        name: [firstName, lastName].filter(Boolean).join(' ') || login || providerId,
        gender,
        mention,
        accounts: {
          create: {
            provider,
            providerId,
            login,
            firstName,
            secondName,
            lastName,
            userpic
          }
        }
      },
      include: { accounts: true }
    });
  }

  /** Получить всех друзей пользователя */
  async getUserFriends(id: string): Promise<Array<UserModel>> {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ fromUserId: id }, { toUserId: id }]
      },
      include: {
        fromUser: {
          include: { accounts: true }
        },
        toUser: {
          include: { accounts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Array.from(
      new Map(
        friendships
          .map((friendship) => (friendship.fromUserId === id ? friendship.toUser : friendship.fromUser))
          .map((user) => [user.id, user])
      ).values()
    );
  }

  /** Принять инвайт от другого пользователя */
  async acceptInviteFromUser(id: string, inviterId: string): Promise<boolean> {
    if (id === inviterId) {
      return false;
    }

    return prisma.$transaction(async (tx) => {
      const user: UserModel = await tx.user.findUniqueOrThrow({
        where: { id }
      });

      if (!user.inviterId) {
        await tx.user.update({
          where: { id },
          data: { inviterId }
        });
      }

      const [leftId, rightId] = [id, inviterId].sort();

      if (
        await tx.friendship.findUnique({
          where: { id: { fromUserId: leftId, toUserId: rightId } }
        })
      ) {
        return false;
      } else {
        await tx.friendship.create({
          data: { fromUserId: leftId, toUserId: rightId }
        });

        await mqService.queueMessage(tx, inviterId, wrapEnvelope({ type: EnvelopeType.USER_INVITE_ACCEPTED, payload: { id } }));

        return true;
      }
    });
  }

  /** Выдать или забрать какой-то пермишен для юзера */
  async toggleUserPermission(id: string, permission: Permission): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const user: UserModel = await tx.user.findUniqueOrThrow({
        where: { id }
      });

      const nextPermissions = toggle(user.permissions, permission);

      await tx.user.update({
        where: { id },
        data: {
          permissions: { set: nextPermissions }
        }
      });

      return nextPermissions.includes(permission);
    });
  }
}

export const userService = new UserService();

import { Context, MiddlewareFn } from 'grammy';
import { createSessionAccessor } from '~/app/bot/utils/create-session-accessor';
import { userService } from '~/app/services/user.service';
import { ExternalAccountProvider, UserModel } from '~/persistence';

export type UserMiddlewareFlavor<C extends Context = Context> = C & {
  user: (force?: boolean) => Promise<UserModel>;
};

type UserMiddlewareSession = {
  user?: UserModel;
};

// todo проверить как работают сессии
/** Добавляет метод получения текущего пользователя. Кеширует его в сессии (а сессия у нас на 20 минут, см. {@link sessionOptions}) */
export function userMiddleware() {
  // Ключ сессии, где хранится информация о юзере
  const key = '$user';

  return ((ctx, next) => {
    const patched = ctx as UserMiddlewareFlavor;
    const session = createSessionAccessor<UserMiddlewareSession>(key, ctx);

    // ⬇️ Добавляет метод для получения информации о пользователе
    patched.user = async (force) => {
      if (force || !session.value?.user) {
        return userService.getUserByExternalAccount(ExternalAccountProvider.TELEGRAM, String(ctx.from!.id)).then((user) => {
          session.value = { user };

          return user;
        });
      } else {
        return session.value.user;
      }
    };

    return next();
  }) satisfies MiddlewareFn;
}

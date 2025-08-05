import { UserModel } from '~/persistence';

declare module 'fastify' {
  interface PassportUser extends UserModel {}
}

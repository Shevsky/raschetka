import { Authenticator } from '@fastify/passport';
import { userService } from '~/app/services/user.service';
import { UserModel } from '~/persistence';

export const authenticator = new Authenticator();

authenticator.registerUserSerializer<UserModel, string>(async (user) => user.id);
authenticator.registerUserDeserializer<string, UserModel>(async (id) => userService.getUser(id));

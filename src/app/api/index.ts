import { server } from '~/app/api/core/server';

export default async function startApi(): Promise<void> {
  await server.listen({ port: Number(process.env.APP_PORT) }).then(() => console.info('✅ API сервер запущен'));
}

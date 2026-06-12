import fastifyPlugin from 'fastify-plugin';
import { deepLinkUrl } from '~/app/bot/config/urls.config';
import { lobbyService } from '~/app/services/lobby.service';
import { generateQRImage } from '~/app/usecases/generate-qr-image.usecase';

export const lobbyController = fastifyPlugin(
  async (instance) => {
    instance.get('/lobby/qr/:id', async (req, reply) => {
      const params = req.params as { id: string };

      const lobby = await lobbyService.getLobbyIfAvailable(params.id, req.user!.id);

      const qr = await generateQRImage(deepLinkUrl(`lobby_${lobby.id}`));

      if (!qr) {
        throw new Error('Не удалось создать QR код');
      }

      return reply.type('image/png').send(Buffer.from(qr));
    });
  },
  { encapsulate: true }
);

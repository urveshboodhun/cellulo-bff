import { FastifyInstance } from 'fastify';
import { getEsims, getEsimByIccid } from '../services/airalo/esims';

export default async function esimsRoutes(app: FastifyInstance) {
  app.get('/esims', async (_request, reply) => {
    try {
      const data = await getEsims();
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      const message = err instanceof Error ? err.message : 'Failed to fetch eSIMs';
      return reply.status(502).send({ success: false, message });
    }
  });

  app.get<{ Params: { iccid: string } }>('/esims/:iccid', async (request, reply) => {
    try {
      const { iccid } = request.params;
      const data = await getEsimByIccid(iccid);
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      const message = err instanceof Error ? err.message : 'Failed to fetch eSIM';
      return reply.status(502).send({ success: false, message });
    }
  });
}

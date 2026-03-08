import { FastifyInstance } from 'fastify';
import { getPackages } from '../services/airalo/packages';

export default async function packagesRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { country?: string } }>('/packages', async (request, reply) => {
    try {
      const { country } = request.query;
      const data = await getPackages(country);
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      const message = err instanceof Error ? err.message : 'Failed to fetch packages';
      return reply.status(502).send({ success: false, message });
    }
  });
}

import { FastifyInstance } from 'fastify';
import healthRoutes from './health';
import packagesRoutes from './packages';
import ordersRoutes from './orders';
import esimsRoutes from './esims';

export default async function routes(app: FastifyInstance) {
  app.register(healthRoutes);
  app.register(packagesRoutes);
  app.register(ordersRoutes);
  app.register(esimsRoutes);
}

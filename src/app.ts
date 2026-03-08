import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import corsPlugin from './plugins/cors';
import authPlugin from './plugins/auth';
import routes from './routes';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(corsPlugin);
  await app.register(authPlugin);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(routes, { prefix: '/api/v1' });

  return app;
}

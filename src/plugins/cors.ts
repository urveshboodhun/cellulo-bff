import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';

export default fp(async function corsPlugin(app: FastifyInstance) {
  const origin =
    env.NODE_ENV === 'development' ? 'http://localhost:3000' : (env.CORS_ORIGIN ?? false);

  await app.register(cors, {
    origin,
    credentials: true,
  });
});

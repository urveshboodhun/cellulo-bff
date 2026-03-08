import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { env } from '../config/env'

export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
  })
}

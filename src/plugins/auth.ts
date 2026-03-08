import { FastifyInstance } from 'fastify'
import jwt from '@fastify/jwt'
import { env } from '../config/env'

export async function registerAuth(app: FastifyInstance): Promise<void> {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  })
}

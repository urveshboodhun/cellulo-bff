import Fastify from 'fastify'
import rateLimit from '@fastify/rate-limit'
import { registerCors } from './plugins/cors'
import { registerAuth } from './plugins/auth'
import { registerRoutes } from './routes'

export async function buildApp() {
  const app = Fastify({ logger: true })

  await registerCors(app)
  await registerAuth(app)

  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  })

  await app.register(
    async (instance) => {
      await registerRoutes(instance)
    },
    { prefix: '/api/v1' },
  )

  return app
}

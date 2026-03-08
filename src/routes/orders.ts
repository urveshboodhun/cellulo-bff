import { FastifyInstance } from 'fastify';
import { createOrder, getOrders } from '../services/airalo/orders';
import { CreateOrderPayload } from '../types/common';

export default async function ordersRoutes(app: FastifyInstance) {
  app.get('/orders', async (_request, reply) => {
    try {
      const data = await getOrders();
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      return reply.status(502).send({ success: false, message });
    }
  });

  app.post<{ Body: CreateOrderPayload }>('/orders', async (request, reply) => {
    try {
      const data = await createOrder(request.body);
      return reply.status(201).send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      const message = err instanceof Error ? err.message : 'Failed to create order';
      return reply.status(502).send({ success: false, message });
    }
  });
}

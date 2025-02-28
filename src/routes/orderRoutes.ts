import { FastifyInstance } from 'fastify'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
} from '../controllers/OrderController.js'

export default async function orderRoutes(fastify: FastifyInstance) {
  // Get all orders
  fastify.get('/orders', getAllOrders)

  // Get order by ID
  fastify.get('/orders/:id', getOrderById)

  // Create new order
  fastify.post('/orders', createOrder)

  // Update order
  fastify.put('/orders/:id', updateOrder)

  // Delete order
  fastify.delete('/orders/:id', deleteOrder)

  // Get orders by user ID
  fastify.get('/users/:uid/orders', getOrdersByUserId)
}

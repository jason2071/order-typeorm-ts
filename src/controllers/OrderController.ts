import { FastifyRequest, FastifyReply } from 'fastify'
import { AppDataSource } from '../config/data-source.js'
import { Order } from '../entities/Order.js'
import { User } from '../entities/User.js'
import { Product } from '../entities/Product.js'
import { customError } from '../utils/errorUtils.js'
import { customSuccess } from '../utils/successUtils.js'

const orderRepository = AppDataSource.getRepository(Order)
const userRepository = AppDataSource.getRepository(User)
const productRepository = AppDataSource.getRepository(Product)

// DTO Types
type CreateOrderDto = {
  uid: string
  productId: number
  amount: number
}

type UpdateOrderDto = {
  amount?: number
}

// Get all orders with pagination
export const getAllOrders = async (
  request: FastifyRequest<{ Querystring: { page?: number; pageSize?: number } }>,
  reply: FastifyReply
) => {
  try {
    const page = request.query.page || 1
    const pageSize = request.query.pageSize || 10

    const [orders, total] = await orderRepository.findAndCount({
      relations: ['user', 'product'],
      select: {
        user: {
          name: true,
          email: true,
        },
        product: {
          name: true,
          description: true,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return customSuccess(reply, 'Orders found', {
      data: orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve orders')
  }
}

// Get order by ID
export const getOrderById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = request.params.id
    const order = await orderRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['user', 'product'],
      select: {
        user: {
          name: true,
          email: true,
        },
        product: {
          name: true,
          description: true,
        },
      },
    })

    if (!order) {
      return customError(request, reply, 404, 'E404', 'Order not found')
    }

    return customSuccess(reply, 'Order found', order)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve order')
  }
}

// Create order
export const createOrder = async (request: FastifyRequest<{ Body: CreateOrderDto }>, reply: FastifyReply) => {
  try {
    const { uid, productId, amount } = request.body

    // Verify user exists
    const user = await userRepository.findOneBy({ uid })
    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    // Verify product exists and has enough stock
    const product = await productRepository.findOneBy({ id: productId })
    if (!product) {
      return customError(request, reply, 404, 'E404', 'Product not found')
    }

    if (product.amount < amount) {
      return customError(request, reply, 400, 'E400', 'Not enough product in stock')
    }

    // Create order
    const order = orderRepository.create({
      uid: user.uid,
      code: product.code,
      amount,
      user,
      product,
    })

    // Update product stock
    product.amount -= amount
    await productRepository.save(product)

    await orderRepository.save(order)
    return customSuccess(reply, 'Order created', { status: 'success' })
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to create order')
  }
}

// Update order
export const updateOrder = async (
  request: FastifyRequest<{
    Params: { id: string }
    Body: UpdateOrderDto
  }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id)
    const { amount } = request.body

    const order = await orderRepository.findOne({
      where: { id },
      relations: ['product'],
    })

    if (!order) {
      return customError(request, reply, 404, 'E404', 'Order not found')
    }

    if (amount !== undefined) {
      // Calculate the difference in amount
      const amountDifference = amount - order.amount

      if (amountDifference !== 0) {
        // Update product stock
        const product = await productRepository.findOneBy({ id: order.id })
        if (!product) {
          return customError(request, reply, 404, 'E404', 'Product not found')
        }

        // Check if we have enough stock for an increase
        if (amountDifference > 0 && product.amount < amountDifference) {
          return customError(request, reply, 400, 'E400', 'Not enough product in stock for the update')
        }

        // Update product stock
        product.amount -= amountDifference
        await productRepository.save(product)

        // Update order amount
        order.amount = amount
        const result = await orderRepository.save(order)

        return reply.code(200).send(result)
      }
    }

    return customSuccess(reply, 'Order updated', order)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to update order')
  }
}

// Delete order
export const deleteOrder = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id)

    const order = await orderRepository.findOne({
      where: { id },
      relations: ['product'],
    })

    if (!order) {
      return customError(request, reply, 404, 'E404', 'Order not found')
    }

    // Return product to stock
    const product = await productRepository.findOneBy({ id: order.id })
    if (product) {
      product.amount += order.amount
      await productRepository.save(product)
    }

    await orderRepository.remove(order)

    return customSuccess(reply, 'Order deleted', null)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to delete order')
  }
}

// Get orders by user ID
export const getOrdersByUserId = async (request: FastifyRequest<{ Params: { uid: string } }>, reply: FastifyReply) => {
  try {
    const uid = request.params.uid

    const user = await userRepository.findOne({ where: { uid } })
    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    const orders = await orderRepository.find({
      where: { uid },
      relations: ['product'],
    })

    return customSuccess(reply, 'User orders found', orders)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve user orders')
  }
}

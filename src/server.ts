import Fastify from 'fastify'
import cors from '@fastify/cors'
import { AppDataSource } from './config/data-source.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

import { customError } from './utils/errorUtils.js'

const startServer = async () => {
  try {
    // Initialize TypeORM connection
    await AppDataSource.initialize()
    console.log('Database connection has been established successfully.')

    const server = Fastify({
      logger: false,
    })

    // Register CORS
    await server.register(cors, {
      origin: true,
    })

    // Register a prefix for all routes
    server.register(
      async (instance, opts, done) => {
        instance.register(productRoutes)
        instance.register(userRoutes)
        instance.register(orderRoutes)
        done()
      },
      { prefix: '/api' }
    )

    // Root route
    server.get('/health', async (request, reply) => {
      return { status: 'ok' }
    })

    // Not found handler
    server.setNotFoundHandler((request, reply) => {
      customError(request, reply, 404, 'E404', 'Route not found')
    })

    // error handling
    server.setErrorHandler((error, request, reply) => {
      console.error(error)
      customError(request, reply)
    })

    // Start server
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5003
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Server is running on port ${port}`)
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

startServer()

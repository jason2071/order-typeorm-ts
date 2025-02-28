import { FastifyInstance } from 'fastify'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCode,
} from '../controllers/ProductController.js'

export default async function productRoutes(fastify: FastifyInstance) {
  // Get all products
  fastify.get('/products', getAllProducts)

  // Get product by ID
  fastify.get('/products/:id', getProductById)

  // Create new product
  fastify.post('/products', createProduct)

  // Update product
  fastify.put('/products/:id', updateProduct)

  // Delete product
  fastify.delete('/products/:id', deleteProduct)

  // Get product by code
  fastify.get('/products/code/:code', getProductByCode)
}

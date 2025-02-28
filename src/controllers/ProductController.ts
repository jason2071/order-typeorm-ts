import { FastifyRequest, FastifyReply } from 'fastify'
import { AppDataSource } from '../config/data-source.js'
import { Product } from '../entities/Product.js'
import { customError } from '../utils/errorUtils.js'
import { customSuccess } from '../utils/successUtils.js'

const productRepository = AppDataSource.getRepository(Product)

// DTO Types
type CreateProductDto = {
  code: string
  name: string
  description: string
  price: number
  amount: number
}

type UpdateProductDto = Partial<CreateProductDto>

// Get all products
export const getAllProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await productRepository.find()
    return customSuccess(reply, 'Products found', products)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve products')
  }
}

// Get product by ID
export const getProductById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id)
    const product = await productRepository.findOneBy({ id })

    if (!product) {
      return reply.code(404).send({ error: 'Product not found' })
    }

    return customSuccess(reply, 'Product found', product)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve product')
  }
}

// Create product
export const createProduct = async (request: FastifyRequest<{ Body: CreateProductDto }>, reply: FastifyReply) => {
  try {
    const { code, name, description, price, amount } = request.body

    const product = productRepository.create({
      code,
      name,
      description,
      price,
      amount,
    })

    const result = await productRepository.save(product)
    return customSuccess(reply, 'Product created', result)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to create product')
  }
}

// Update product
export const updateProduct = async (
  request: FastifyRequest<{
    Params: { id: string }
    Body: UpdateProductDto
  }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id)
    const updateData = request.body

    const product = await productRepository.findOneBy({ id })

    if (!product) {
      return customError(request, reply, 404, 'E404', 'Product not found')
    }

    productRepository.merge(product, updateData)
    const result = await productRepository.save(product)

    return customSuccess(reply, 'Product updated', result)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to update product')
  }
}

// Delete product
export const deleteProduct = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id)

    const product = await productRepository.findOneBy({ id })

    if (!product) {
      return customError(request, reply, 404, 'E404', 'Product not found')
    }

    await productRepository.remove(product)

    return customSuccess(reply, 'Product deleted', null)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to delete product')
  }
}

// Get product by code
export const getProductByCode = async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
  try {
    if (!request.params.code) {
      return customError(request, reply, 400, 'E400', 'Code is required')
    }

    const code = request.params.code.toUpperCase()
    const product = await productRepository.findOneBy({ code: code })

    if (!product) {
      return customError(request, reply, 404, 'E404', 'Product not found')
    }

    return customSuccess(reply, 'Product found', product)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve product')
  }
}

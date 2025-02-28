import { FastifyRequest, FastifyReply } from 'fastify'
import { AppDataSource } from '../config/data-source.js'
import { User } from '../entities/User.js'
import { v4 as uuidv4 } from 'uuid'
import { customError } from '../utils/errorUtils.js'
import { customSuccess } from '../utils/successUtils.js'

const userRepository = AppDataSource.getRepository(User)

// DTO Types
type CreateUserDto = {
  uid: string
  name: string
  email: string
}

type UpdateUserDto = Partial<CreateUserDto>

// Get all users
export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userRepository.find()
    // return reply.code(200).send(users)
    return customSuccess(reply, 'Users found', users)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve users')
  }
}

// Get user by ID
export const getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id)
    const user = await userRepository.findOneBy({ id })

    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    return customSuccess(reply, 'User found', user)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve user')
  }
}

// Create user
export const createUser = async (request: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
  try {
    const { name, email } = request.body

    // Check if email already exists
    const existingUser = await userRepository.findOneBy({ email })
    if (existingUser) {
      return customError(request, reply, 409, 'E409', 'Email already in use')
    }

    const uid = uuidv4()

    const user = userRepository.create({
      uid,
      name,
      email,
    })

    const result = await userRepository.save(user)
    return customSuccess(reply, 'User created', result)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to create user')
  }
}

// Update user
export const updateUser = async (
  request: FastifyRequest<{
    Params: { id: string }
    Body: UpdateUserDto
  }>,
  reply: FastifyReply
) => {
  try {
    const id = parseInt(request.params.id)
    const updateData = request.body

    const user = await userRepository.findOneBy({ id })

    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    // Check if email is being updated and is already in use
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await userRepository.findOneBy({ email: updateData.email })
      if (existingUser) {
        return customError(request, reply, 409, 'E409', 'Email already in use')
      }
    }

    userRepository.merge(user, updateData)
    const result = await userRepository.save(user)

    return customSuccess(reply, 'User updated', result)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to update user')
  }
}

// Delete user
export const deleteUser = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const id = parseInt(request.params.id)

    const user = await userRepository.findOneBy({ id })

    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    await userRepository.remove(user)

    return customSuccess(reply, 'User deleted', null)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to delete user')
  }
}

export const getUserByUid = async (request: FastifyRequest<{ Params: { uid: string } }>, reply: FastifyReply) => {
  try {
    const uid = request.params.uid
    const user = await userRepository.findOneBy({ uid })

    if (!user) {
      return customError(request, reply, 404, 'E404', 'User not found')
    }

    return customSuccess(reply, 'User found', user)
  } catch (error) {
    console.log(error)
    return customError(request, reply, 500, 'E500', 'Failed to retrieve user')
  }
}

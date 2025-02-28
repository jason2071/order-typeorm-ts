import { FastifyInstance } from 'fastify'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByUid } from '../controllers/UserController.js'

export default async function userRoutes(fastify: FastifyInstance) {
  // Get all users
  fastify.get('/users', getAllUsers)

  // Get user by ID
  fastify.get('/users/:id', getUserById)

  // Create new user
  fastify.post('/users', createUser)

  // Update user
  fastify.put('/users/:id', updateUser)

  // Delete user
  fastify.delete('/users/:id', deleteUser)

  // Get user by uid
  fastify.get('/users/uid/:uid', getUserByUid)
}

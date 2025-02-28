import { FastifyReply, FastifyRequest } from 'fastify'

// Define the ErrorMapping type
type ErrorMapping = {
  apiErrorCode: string
  message: string
}

// Define constants for error codes
const E400 = 'E400' // Error not found
const E401 = 'E401' // Error invalid request body
const E402 = 'E402' // Validation failed
const E403 = 'E403' // Cannot parse JSON

// Define the error mappings
const errMapping: ErrorMapping[] = [
  { apiErrorCode: E400, message: 'Error Not Found' },
  { apiErrorCode: E401, message: 'Error invalid request body' },
  { apiErrorCode: E402, message: 'Validation failed' },
  { apiErrorCode: E403, message: 'Cannot parse JSON' },
]

// Utility function to get an error message based on the code
function getErrorMessage(code: string): string {
  const error = errMapping.find(err => err.apiErrorCode === code)
  return error ? error.message : 'Unknown error'
}

// Define the ApiError type
export class ApiError extends Error {
  timestamp: string
  status: number
  errorDetails: string
  errorCode: string
  path: string

  constructor(status: number, errorCode: string, errorDetails: string, path: string, message?: string) {
    super(message || getErrorMessage(errorCode))
    this.timestamp = new Date().toISOString()
    this.status = status
    this.errorDetails = errorDetails
    this.errorCode = errorCode
    this.path = path
  }
}

// Function to create a new custom error
function newCustomError(status: number, errorCode: string, errDetails: string, req: FastifyRequest): ApiError {
  const path = req.url // Get the request path from Fastify's request object
  return new ApiError(status, errorCode, errDetails, path)
}

export function customError(
  request: FastifyRequest,
  reply: FastifyReply,
  statusCode: number = 500,
  errorCode: string = 'E500',
  errorMessage: string = 'Internal Server Error'
) {
  const customError = newCustomError(statusCode, errorCode, errorMessage, request)
  reply.code(customError.status).send({
    message: customError.message,
    timestamp: customError.timestamp,
    status: customError.status,
    errorDetails: customError.errorDetails,
    errorCode: customError.errorCode,
    path: customError.path,
  })
}

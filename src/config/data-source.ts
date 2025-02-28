import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entities/User.js'
import { Product } from '../entities/Product.js'
import { Order } from '../entities/Order.js'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '1q2w3e4r',
  database: process.env.DB_NAME || 'order_db',
  synchronize: true,
  logging: false,
  entities: [User, Product, Order],
  subscribers: [],
  migrations: [],
})

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Order } from './Order.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'uuid', unique: true })
  uid!: string

  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}
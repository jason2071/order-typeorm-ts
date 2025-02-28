import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './User.js'
import { Product } from './Product.js'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  uid!: string

  @Column()
  code!: string

  @Column()
  amount!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  @ManyToOne(() => User, user => user.id)
  user!: User

  @ManyToOne(() => Product, product => product.id)
  product!: Product
}

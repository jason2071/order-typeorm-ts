import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  code!: string
 
  @Column()
  name!: string

  @Column()
  description!: string

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number

  @Column()
  amount!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}

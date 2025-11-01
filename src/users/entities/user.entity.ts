import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string; // hashed

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // ⚡ por defecto todos son user
  })
  role?: UserRole;

  // relaciones (lazy) - cargar orders solo cuando se necesita
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

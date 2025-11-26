// size.entity.ts
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  name: string;

  // Lado inverso - NO usa @JoinTable
  @ManyToMany(() => Product, (product) => product.sizes)
  products: Product[];
}

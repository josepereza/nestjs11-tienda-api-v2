import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { OrderLine } from 'src/orders/entities/order-line.entity';
import { Size } from 'src/sizes/entities/size.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // eager: true -> las imágenes se cargarán automáticamente al obtener el producto
  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];
  @OneToMany(() => OrderLine, (line) => line.product)
  orderLines: OrderLine[];

  // Relación Many-to-Many CORRECTA
  @ManyToMany(() => Size, (size) => size.products)
  @JoinTable({
    name: 'product_sizes', // nombre de la tabla pivote
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      // ← ¡SÍ EXISTE en @JoinTable!
      name: 'size_id',
      referencedColumnName: 'id',
    },
  })
  sizes: Size[];
}

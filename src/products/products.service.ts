import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Size } from 'src/sizes/entities/size.entity';
export interface ProductoMasVendido {
  id: number;
  title: string;
  totalVendidos: number;
}
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Size) private sizesRepo: Repository<Size>,

    @InjectRepository(ProductImage)
    private imagesRepo: Repository<ProductImage>,
    private readonly dataSource: DataSource, // 👈 INYECTADO AQUÍ
  ) {}

  async create(createProductDto: CreateProductDto) {
    /*  const { sizes = [], ...productDetails } = createProductDto;

    const foundSizes = await this.sizeRepository.find({
      where: { id: In(sizes) },
    }); */
    //const { images = ProductImage[], ...productDetails } = createProductDto;

    // Solución segura para sizes
    const sizes: number[] = Array.isArray(createProductDto.sizes)
      ? createProductDto.sizes
      : [];

    const { sizes: _, images, ...productDetails } = createProductDto;

    console.log('✅ Tallas procesadas:', sizes);

    // Buscar tallas existentes
    let foundSizes: Size[] = [];
    if (sizes.length > 0) {
      foundSizes = await this.sizesRepo.find({
        where: { id: In(sizes) }, // ← Ahora In está importado
      });

      //alternativa a In - con query builder
      /*  foundSizes = await this.sizesRepo
  .createQueryBuilder('size')
  .where('size.id IN (:...ids)', { ids: sizes })
  .getMany();  
 */
      // Validar que existen todas las tallas
      if (foundSizes.length !== sizes.length) {
        const foundIds = foundSizes.map((size) => size.id);
        const missingIds = sizes.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Tallas no encontradas: ${missingIds.join(', ')}`,
        );
      }
    }

    // Crear producto
    console.log('estos son las imagenes', images);
    const product = this.productsRepo.create({
      ...productDetails,
      sizes: foundSizes,
      images,
    });

    return await this.productsRepo.save(product);
  }

  findAll() {
    return this.productsRepo.find(); // images vienen por eager
  }

  findOne(id: number) {
    return this.productsRepo.findOne({ where: { id } });
  }

  async addImage(productId: number, filePath: string) {
    const product = await this.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');
    const img = this.imagesRepo.create({ path: filePath, product });
    return this.imagesRepo.save(img);
  }

  async removeImage(id: number) {
    return this.imagesRepo.delete(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
  async getProductoMasVendidoDelMesSQL() {
    const ahora = new Date();
    const mes = ahora.getMonth() + 1;
    const año = ahora.getFullYear();

    const sql = `
    SELECT 
  p.id,
  p.title,
  SUM(ol.quantity) AS totalVendidos
FROM order_lines ol
INNER JOIN product p ON p.id = ol.productId
INNER JOIN orders o ON o.id = ol.orderId
WHERE MONTH(o.created_at) = ?
  AND YEAR(o.created_at) = ?
GROUP BY p.id
ORDER BY totalVendidos DESC
LIMIT 1;
  `;

    const resultado = await this.dataSource.query<ProductoMasVendido[]>(sql, [
      mes,
      año,
    ]);

    if (resultado.length === 0)
      throw new NotFoundException('No hay ventas este mes');

    return resultado[0];
  }

  async productoMasVendidoDelMes(): Promise<ProductoMasVendido | null> {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const resultado = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('p')
      .leftJoin('p.orderLines', 'ol')
      .leftJoin('ol.order', 'o')
      .select('p.id', 'id')
      .addSelect('p.title', 'title')
      .addSelect('SUM(ol.quantity)', 'totalVendidos')
      .where('o.created_at >= :inicioMes', { inicioMes })
      .groupBy('p.id')
      .orderBy('totalVendidos', 'DESC')
      .limit(1)
      .getRawOne<ProductoMasVendido>();

    return resultado ?? null;
  }
}

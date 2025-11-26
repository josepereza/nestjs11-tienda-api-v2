import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  @IsOptional()
  @IsArray({ message: 'Las tallas deben ser un array de números' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos una talla' })
  @IsNumber({}, { each: true, message: 'Cada talla debe ser un número' })
  @Min(1, { each: true, message: 'Cada ID de talla debe ser mayor a 0' })
  @Type(() => Number) // Transforma cada elemento del array a number
  sizes?: number[];
}

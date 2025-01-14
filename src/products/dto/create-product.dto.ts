import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsInt()
  priceSubunit: number;

  @ApiProperty({ enum: ['USD', 'GBP', 'EUR', 'THB'] })
  @IsString()
  @Length(3, 3)
  priceCurrency: string;


  categories: [string];
}

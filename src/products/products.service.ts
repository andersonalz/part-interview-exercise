import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { And, Equal, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { FilterProductsDto } from './dto/query-product.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(filters: FilterProductsDto) {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (filters.name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.price_subunit?.gte !== undefined) {
      console.log("🚀 ~ ProductsService ~ findAll ~ filters:", filters.price_subunit.gte)
      queryBuilder.andWhere('product.price_subunit >= :gte', { gte: filters.price_subunit.gte });
    }

    if (filters.price_subunit?.lte !== undefined) {
      queryBuilder.andWhere('product.price_subunit <= :lte', { lte: filters.price_subunit.lte });
    }

    return queryBuilder.getMany();
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: {
        id,
      },
      relations: ['categories'],
    });
  }

  async create(createProductDto: CreateProductDto) {
    const categories = createProductDto.categories && (await Promise.all(
       createProductDto.categories.map((categories) => {
         return this.preloadCategory(categories);
      }),
    ))

    const coffee = this.productsRepository.create({
      ...createProductDto,
      categories,
    });
    return await this.productsRepository.save(coffee);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const categories =
      updateProductDto.categories &&
      (await Promise.all(
        updateProductDto.categories.map((category) => {
          return this.preloadCategory(category);
        }),
      ));
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
      categories,
    });

  if(!product) {
      throw new NotFoundException(`coffee with ${id} not found`);
    }
    return this.productsRepository.save(product);
  }

  remove(product: Product) {
    return this.productsRepository.delete(product.id);
  }

  private async preloadCategory(name: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });
    if (!existingCategory) {
      const category = this.categoryRepository.create({ name });
      return this.categoryRepository.save(category);
    }

    return existingCategory;
  }
}

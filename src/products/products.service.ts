import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as UUID } from 'uuid';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({ ...productDetails, images: images.map(image => this.productImageRepository.create({ url: image })) })
      await this.productRepository.save(product)

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async findAll(paginationDto: PaginationDto) {
    try {

      const { limit = 10, offset = 0 } = paginationDto;

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      })

      return products.map(product => ({ ...product, images: (product.images ?? []).map(img => img.url) }))

    } catch (error) {
      this.handleDBExceptions(error)

    }
  }

  async findOne(term: string) {
    try {
      let product: Product | null;

      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term })

      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder.where(
          ('UPPER(title) =:title or slug =:slug'), {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        },
        )
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }

      if (!product) {
        throw new NotFoundException(`Product with term "${term}" not found`);
      }

      return product;

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  async findOnePlain(term: string) {
    const product = await this.findOne(term);
    if (!product) {
      throw new NotFoundException(`Product with term "${term}" not found`);
    }
    const { images = [], ...rest } = product;
    return {
      ...rest,
      images: images.map(img => img.url),

    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`)
    }
    try {
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const { affected } = await this.productRepository.delete({ id })
      if (affected === 0) {
        return `Product with id "${id}" not found`
      }
      return `Product with id "${id}" has been deleted`

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(e: any) {
    if (e.code === '23505') {
      throw new BadRequestException(e.detail)
    }

    this.logger.error(e);
    throw new InternalServerErrorException('Unexpected error - Check server logs')

  }

}

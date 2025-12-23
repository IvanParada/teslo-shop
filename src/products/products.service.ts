import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  //TODO: PAGINAR
  findAll() {
    try {
      return this.productRepository.find()

    } catch (error) {
      this.handleDBExceptions(error)

    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id })

      if (!product) {
        throw new NotFoundException(`Product with id "${id}" not found`);
      }

      return product;

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}
  // 상품 생성 api
  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepo.create(createProductDto);
    await this.productRepo.save(newProduct);
    return newProduct;
  }
  // 전체 상품 조회 api
  async getProducts() {
    const products = await this.productRepo.find();
    if (products) return products;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  // 특정 상품 조회 api
  async getProduct(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (product) return product;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  // 특정 상품 수정 api
  async updateProduct(id: string, updateProductDto: CreateProductDto) {
    await this.productRepo.update(id, updateProductDto);
    const updateProduct = await this.productRepo.findOneBy({ id });
    if (updateProduct) return updateProduct;
    throw new HttpException('Updated Failed', HttpStatus.BAD_REQUEST);
  }

  // 특정 상품 삭제 api
  async deleteProduct(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      return 'Delete Failed';
    }
    await this.productRepo.delete(id);
    return 'Delete Success';
  }

  // 전체 상품 삭제 api
  async deleteProducts() {
    await this.productRepo.clear();
    return 'All Delete Success';
  }
}

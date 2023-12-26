import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 상품 생성 api
  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  // 전체 상품 조회 api
  @Get('all')
  async getProducts() {
    return await this.productService.getProducts();
  }

  // 특정 상품 조회 api
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  // 특정 상품 수정 api
  @Patch('/update/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  // 특정 상품 삭제 api
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  // 전체 상품 삭제 api
  @Delete()
  async deleteProducts() {
    return await this.productService.deleteProducts();
  }
}

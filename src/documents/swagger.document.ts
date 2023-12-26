// import { DocumentBuilder } from '@nestjs/swagger';
//
// export class BaseAPIDocument {
//   public builder = new DocumentBuilder();
//   public initializeOption() {
//     return this.builder
//       .setTitle('Jisu API Ecommerce')
//       .setDescription('Jisu API Ecommerce')
//       .setVersion('1.0')
//       .build();
//   }
// }

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('NestJS Study API Docs')
    .setDescription('NestJS Study API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}

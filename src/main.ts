import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './documents/swagger.document';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  const configService = app.get(ConfigService);

  const port = configService.get('SERVICE_PORT') || 3000;
  await app.listen(port);
}
bootstrap();

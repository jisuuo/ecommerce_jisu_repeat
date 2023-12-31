import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  // options 모두 다 설정 가능
  // options 설정된 도메인만 접속이 가능
  // 추후에 프론트엔드 서버 도메인 설정해주면 됨
  app.enableCors();
  app.setGlobalPrefix('api');
  const port = configService.get('SERVICE_PORT') || 3000;

  await app.listen(port);
}
bootstrap();

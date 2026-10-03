import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  // Global Middlewares & Filters
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  // Enable CORS
  app.enableCors({
    origin: [
      configService.get<string>('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
      'http://localhost:3000',
    ],
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // OpenAPI / Swagger Specs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WeGen Platform API')
    .setDescription('Production-ready Ethiopian Crowdfunding, Giving & Organization REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`🚀 WeGen NestJS API is running on http://localhost:${port}/api/v1`);
  logger.log(`📚 API Swagger Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();

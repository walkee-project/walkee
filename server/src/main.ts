import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as path from 'path';
import cookieParser from 'cookie-parser';

// 환경변수 가장 먼저 로드
config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 쿠키 파서 미들웨어 등록
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe()); // 유효성 검사
  app.enableCors({
    origin: [
      'http://192.168.0.82:5173',
      'http://localhost:5173',
      'https://trusted-hippo-finally.ngrok-free.app', // 프론트엔드 ngrok
    ],
    credentials: true, // 쿠키 주고받기 위해 반드시 필요
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000);
}
bootstrap();

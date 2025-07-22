import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

// 환경변수 가장 먼저 로드
config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 제공 (예: 썸네일 이미지)
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // 쿠키 파서 미들웨어 등록
  app.use(cookieParser());

  // 전역 파이프
  app.useGlobalPipes(new ValidationPipe()); // 유효성 검사

  // CORS 설정
  app.enableCors({
    origin: [
      'http://192.168.0.82:5173',
      'http://192.168.0.70:5173',
      'http://192.168.0.72:5173',
      'http://localhost:5173',
      'https://trusted-hippo-finally.ngrok-free.app', // 프론트엔드 ngrok
    ],
    credentials: true, // 쿠키 주고받기 위해 반드시 필요
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

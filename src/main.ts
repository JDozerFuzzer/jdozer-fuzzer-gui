import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { FrontendModule } from './jdozer/fuzzer/frontend/frontend.module';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    await ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    });
  } catch (error) {
    console.error('Error setting up configuration!', error.message);
    process.exit(1);
  }
  const app = await NestFactory.create<NestExpressApplication>(FrontendModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['X-Requested-With', 'Content-Type']
  });
  app.useGlobalPipes(new ValidationPipe());
  console.debug('PORT:', process.env.FUZZER_GUI_PORT);
  await app.listen(process.env.FUZZER_GUI_PORT);
}
bootstrap();

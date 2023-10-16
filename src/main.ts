import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { datasource } from './config/db';
import { ENV } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import { customQueryParser } from './middlewares/custom-query.middleware';

async function bootstrap() {
  try {
    console.log('Initializing database...');
    await datasource.initialize();
    console.log('Database initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(customQueryParser);

  await app.listen(ENV.PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeSwaggerJson } from './utils/swagger';
import { INestApplication } from '@nestjs/common';

const initSwagger = (app: INestApplication) => {
  const server = app.getHttpAdapter();
  const options = new DocumentBuilder()
    .setTitle('Karura DEX Info')
    .setDescription('')
    .setVersion('0.0.1')
    .addTag('dex_info')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  writeSwaggerJson(`.`, document);
  SwaggerModule.setup('api', app, document);
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(helmet());
  // app.use(csurf());

  initSwagger(app);

  await app.listen(3000);
}
bootstrap();

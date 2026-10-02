import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// Configuração compartilhada entre o servidor local (main.ts) e a função serverless da Vercel (serverless.ts).
export function configureApp(app: INestApplication) {
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Em produção o front web chama /api no mesmo domínio e o app nativo não
  // envia Origin, então só libera CORS para origens listadas em CORS_ORIGINS.
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length
      ? corsOrigins
      : process.env.NODE_ENV !== 'production',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ProtomApp API')
    .setDescription('API do ProtomApp — saúde educacional e protocolar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

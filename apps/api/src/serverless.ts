import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

type ExpressHandler = (req: Request, res: Response) => void;

// A instância do Nest é criada uma vez por instância da função e reaproveitada
// entre invocações (evita refazer o bootstrap e reabrir conexões com o banco).
let cachedHandler: Promise<ExpressHandler> | undefined;

async function createHandler(): Promise<ExpressHandler> {
  const adapter = new ExpressAdapter();
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn'],
  });
  configureApp(app);
  await app.init();
  return adapter.getInstance<ExpressHandler>();
}

export default async function handler(req: Request, res: Response) {
  cachedHandler ??= createHandler().catch((err) => {
    cachedHandler = undefined;
    throw err;
  });
  const expressApp = await cachedHandler;
  expressApp(req, res);
}

import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// const cookieSession = require('cookie-session');

// we could decide to use this in the e2e instead of the NestJS procedure
/* export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['asdfasdf'], // to encrypt the info inside the cookie
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
}; */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setupApp(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

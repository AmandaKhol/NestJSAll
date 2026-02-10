import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    // Nest recomendation for test db
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    // no Nest recommendation
    /*     TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite'; 
      entities: [User, Report],
      synchronize: true, // only in dev, danger in Prod (changes in DB)
    }), */
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasdf'], // to encrypt the info inside the cookie
        }),
      )
      .forRoutes('*');
  }
}

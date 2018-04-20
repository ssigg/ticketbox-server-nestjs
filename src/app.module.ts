import { Module, NestModule, RequestMethod, MiddlewaresConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventsCommonModule, EventsAdminModule } from './event/events.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Event],
      url: process.env.DATABASE_URL,
      synchronize: true,
    }),
    AuthModule,
    EventsCommonModule,
    EventsAdminModule
  ],
  controllers: [],
  components: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {
    consumer.apply([ CorsMiddleware ]).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}

import { Module, NestModule, RequestMethod, MiddlewaresConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsCommonModule, EventsAdminModule } from './event/events.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './cors.middleware';
import { Event } from './event/event.entity';
import { Block, Eventblock } from './block/block.entities';
import { Seat } from './seat/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [ Event, Block, Eventblock, Seat ],
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

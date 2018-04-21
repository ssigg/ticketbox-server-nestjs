import { Module, NestModule, RequestMethod, MiddlewaresConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsCommonModule, EventsAdminModule } from './event/events.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './cors.middleware';
import { Event } from './event/event.entity';
import { Block } from './block/block.entity';
import { Seat } from './seat/seat.entity';
import { BlocksAdminModule } from './block/blocks.module';
import { Category } from './category/category.entity';
import { Eventblock } from './eventblock/eventblock.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [ Event, Category, Block, Eventblock, Seat ],
      url: process.env.DATABASE_URL,
      synchronize: true,
    }),
    AuthModule,
    EventsCommonModule,
    EventsAdminModule,
    BlocksAdminModule
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

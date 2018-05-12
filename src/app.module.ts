import { Module, NestModule, RequestMethod, MiddlewaresConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule, EventsAdminModule } from './event/events.module';
import { CategoriesAdminModule } from './category/categories.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './cors.middleware';
import { SessionTokenMiddleware } from './session-token.middleware';
import { Event } from './event/event.entity';
import { Block } from './block/block.entity';
import { Seat } from './seat/seat.entity';
import { BlocksAdminModule } from './block/blocks.module';
import { Category } from './category/category.entity';
import { Eventblock } from './eventblock/eventblock.entity';
import { EventblocksModule, EventblocksAdminModule } from './eventblock/eventblocks.module';
import { SeatsAdminModule } from './seat/seats.module';
import { Reservation } from './reservation/reservation.entity';
import { UuidFactory } from './utils/uuid.factory';
import { ReservationsModule, ReservationsAdminModule } from './reservation/reservations.module';
import { Order } from './order/order.entity';
import { OrdersModule } from './order/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [ Event, Category, Block, Eventblock, Seat, Reservation, Order ],
      url: process.env.DATABASE_URL,
      synchronize: true
    }),
    AuthModule,
    EventsModule,
    CategoriesAdminModule,
    EventsAdminModule,
    BlocksAdminModule,
    EventblocksModule,
    EventblocksAdminModule,
    SeatsAdminModule,
    ReservationsModule,
    ReservationsAdminModule,
    OrdersModule
  ],
  controllers: [],
  components: [ UuidFactory ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {
    consumer.apply([ CorsMiddleware, SessionTokenMiddleware ]).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}

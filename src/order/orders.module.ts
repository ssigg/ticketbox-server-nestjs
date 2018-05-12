import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/event.entity';
import { Category } from '../category/category.entity';
import { Seat } from '../seat/seat.entity';
import { Reservation } from '../reservation/reservation.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { UuidFactory } from '../utils/uuid.factory';
import { TokenTimeService } from '../utils/token-time.service';
import { ReservationsService } from '../reservation/reservations.service';
import { OrdersService } from './orders.service';
import { BasketService } from '../reservation/basket.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Seat, Reservation, Order ]) ],
    components: [ UuidFactory, TokenTimeService, ReservationsService, OrdersService, BasketService ],
    controllers: [ OrdersController ]
})
export class OrdersModule { }
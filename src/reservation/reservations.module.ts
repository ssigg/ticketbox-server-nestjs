import * as passport from 'passport';
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";
import { Reservation } from "./reservation.entity";
import { ReservationsService } from "./reservations.service";
import { ReservationsController, ReservationsAdminController, ReservationsExpirationTimestampController } from "./reservations.controller";
import { UuidFactory } from "../utils/uuid.factory";
import { AuthService } from "../auth/auth.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { BasketService } from './basket.service';
import { TokenTimeService } from './token-time.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Seat, Reservation ]) ],
    components: [ UuidFactory, TokenTimeService, ReservationsService, BasketService ],
    controllers: [ ReservationsController, ReservationsExpirationTimestampController ]
})
export class ReservationsModule { }

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Seat, Reservation ]) ],
    components: [ AuthService, JwtStrategy, UuidFactory, ReservationsService ],
    controllers: [ ReservationsAdminController ]
})
export class ReservationsAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/reservations*', method: RequestMethod.POST & RequestMethod.GET & RequestMethod.PUT & RequestMethod.DELETE });
    }
}
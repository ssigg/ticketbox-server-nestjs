import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";
import { Reservation } from "./reservation.entity";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { UuidFactory } from "../utils/uuid.factory";
import { TokenService } from "../utils/token.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Seat, Reservation ]) ],
    components: [ UuidFactory, TokenService, ReservationsService ],
    controllers: [ ReservationsController ]
})
export class ReservationsModule { }
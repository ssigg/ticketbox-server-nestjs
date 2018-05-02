import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { EventsService } from "./events.service";
import { EventsController, EventsAdminController } from "./events.controller";
import { NestModule } from "@nestjs/common/interfaces";
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { EventblocksService } from '../eventblock/eventblocks.service';
import { Category } from '../category/category.entity';
import { Block } from '../block/block.entity';
import { Eventblock } from '../eventblock/eventblock.entity';
import { Seat } from '../seat/seat.entity';
import { SeatsService } from '../seat/seats.service';
import { Reservation } from '../reservation/reservation.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Block, Eventblock, Seat, Reservation ]) ],
    components: [ EventsService, EventblocksService, SeatsService ],
    controllers: [ EventsController ]
})
export class EventsModule { }

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Block, Eventblock, Seat, Reservation ]) ],
    components: [ AuthService, JwtStrategy, EventsService, EventblocksService, SeatsService ],
    controllers: [ EventsAdminController ]
})
export class EventsAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/events*', method: RequestMethod.POST & RequestMethod.GET & RequestMethod.PUT & RequestMethod.DELETE });
    }
}
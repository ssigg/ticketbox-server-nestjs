import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventblocksService } from './eventblocks.service';
import { EventblocksController, EventblocksAdminController } from './eventblocks.controller';
import { Event } from '../event/event.entity';
import { Category } from '../category/category.entity';
import { Eventblock } from './eventblock.entity';
import { Seat } from '../seat/seat.entity';
import { Block } from '../block/block.entity';
import { SeatsService } from '../seat/seats.service';
import { Reservation } from '../reservation/reservation.entity';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Block, Eventblock, Seat, Reservation ]) ],
    components: [ EventblocksService, SeatsService ],
    controllers: [ EventblocksController ]
})
export class EventblocksModule { }

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Block, Eventblock, Seat, Reservation ]) ],
    components: [ AuthService, JwtStrategy, EventblocksService, SeatsService ],
    controllers: [ EventblocksAdminController ]
})
export class EventblocksAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/eventblocks*', method: RequestMethod.POST & RequestMethod.GET & RequestMethod.PUT & RequestMethod.DELETE });
    }
}
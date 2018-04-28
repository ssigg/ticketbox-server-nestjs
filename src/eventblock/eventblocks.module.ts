import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventblocksService } from './eventblocks.service';
import { EventblocksController } from './eventblocks.controller';
import { Event } from '../event/event.entity';
import { Category } from '../category/category.entity';
import { Eventblock } from './eventblock.entity';
import { Seat } from '../seat/seat.entity';
import { Block } from '../block/block.entity';
import { SeatsService } from '../seat/seats.service';
import { Reservation } from '../reservation/reservation.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event, Category, Block, Eventblock, Seat, Reservation ]) ],
    components: [ EventblocksService, SeatsService ],
    controllers: [ EventblocksController ]
})
export class EventblocksModule { }
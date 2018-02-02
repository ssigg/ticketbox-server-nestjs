import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { EventsService } from "./events.service";
import { EventsCommonController, EventsAdminController } from "./events.controller";

@Module({
    imports: [ TypeOrmModule.forFeature([ Event ]) ],
    components: [ EventsService ],
    controllers: [ EventsCommonController ]
})
export class EventsCommonModule { }

@Module({
    imports: [ TypeOrmModule.forFeature([ Event ]) ],
    components: [ EventsService ],
    controllers: [ EventsCommonController, EventsAdminController ]
})
export class EventsAdminModule { }
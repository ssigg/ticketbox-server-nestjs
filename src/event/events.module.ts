import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { EventsService } from "./events.service";
import { EventsController, EventsAdminController } from "./events.controller";
import { NestModule } from "@nestjs/common/interfaces";
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [ TypeOrmModule.forFeature([ Event ]) ],
    components: [ EventsService ],
    controllers: [ EventsController ]
})
export class EventsCommonModule { }

@Module({
    imports: [ TypeOrmModule.forFeature([ Event ]) ],
    components: [ AuthService, JwtStrategy, EventsService ],
    controllers: [ EventsAdminController ]
})
export class EventsAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/*', method: RequestMethod.ALL });
    }
 }
import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestModule } from "@nestjs/common/interfaces";
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { SeatsAdminController } from './seats.controller';
import { SeatsService } from './seats.service';
import { Seat } from './seat.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([ Seat ]) ],
    components: [ AuthService, JwtStrategy, SeatsService ],
    controllers: [ SeatsAdminController ]
})
export class SeatsAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/*', method: RequestMethod.ALL });
    }
}
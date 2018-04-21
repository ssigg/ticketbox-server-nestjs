import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestModule } from "@nestjs/common/interfaces";
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Block } from './block.entity';
import { BlocksAdminController } from './blocks.controller';
import { BlocksService } from './blocks.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ Block ]) ],
    components: [ AuthService, JwtStrategy, BlocksService ],
    controllers: [ BlocksAdminController ]
})
export class BlocksAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/*', method: RequestMethod.ALL });
    }
 }
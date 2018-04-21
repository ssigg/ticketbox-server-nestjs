import * as passport from 'passport';
import { Module, MiddlewaresConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestModule } from "@nestjs/common/interfaces";
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CategoriesAdminController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([ Category ]) ],
    components: [ AuthService, JwtStrategy, CategoriesService ],
    controllers: [ CategoriesAdminController ]
})
export class CategoriesAdminModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/admin/*', method: RequestMethod.ALL });
    }
 }
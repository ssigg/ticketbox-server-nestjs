import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
    components: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
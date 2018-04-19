import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('token')
  async createToken(@Body() login: { user: string, pass: string }): Promise<any> {
    return await this.authService.createToken(login);
  }
}
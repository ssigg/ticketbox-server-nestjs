import * as jwt from 'jsonwebtoken';
import { Component } from '@nestjs/common';

@Component()
export class AuthService {
    async createToken(login: { user: string, pass: string }) {
        const expiresIn = 60 * 60;
        const secretOrPrivateKey = process.env.JWT_SECRET || 'jwt_secret';
        const token = jwt.sign(login, secretOrPrivateKey, { expiresIn });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

    async validateUser(signedUser): Promise<boolean> {
        return true;
    }
}
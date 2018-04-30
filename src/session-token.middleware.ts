import * as uuidv4 from 'uuid/v4';
import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";
import { TokenService } from './utils/token.service';

@Middleware()
export class SessionTokenMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) { }
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            req.session.token = (req.session.token || this.tokenService.getToken());
            next();
        };
    }
}
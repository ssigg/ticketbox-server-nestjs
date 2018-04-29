import * as uuidv4 from 'uuid/v4';
import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";
import { UuidFactory } from './uuid.factory';

@Middleware()
export class SessionTokenMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: UuidFactory) { }
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            req.session.token = (req.session.token || this.tokenService.create());
            next();
        };
    }
}
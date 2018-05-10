import * as uuidv4 from 'uuid/v4';
import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";
import { BasketService } from './reservation/basket.service';

@Middleware()
export class SessionTokenMiddleware implements NestMiddleware {
    constructor(private readonly basketService: BasketService) { }
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            req.session.token = this.basketService.initializeAndReturnToken(req.session.token);
            next();
        };
    }
}
import * as uuidv4 from 'uuid/v4';
import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";

@Middleware()
export class SessionTokenMiddleware implements NestMiddleware {
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            req.session.token = (req.session.token || uuidv4());
            next();
        };
    }
}
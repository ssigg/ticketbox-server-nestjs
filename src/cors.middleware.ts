import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";

@Middleware()
export class CorsMiddleware implements NestMiddleware {
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Controll-Allow-Headers, Authorization, X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            next();
        };
    }
}
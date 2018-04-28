import * as express from 'express';
import * as cookieSession from 'cookie-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const instance = new express();
	instance.use(cookieSession({
		name: 'token',
		secret: process.env.SESSION_SECRET || 'secret'
	}));
	
	let app = await NestFactory.create(AppModule, instance);
	if (process.env.PORT) {
		await app.listen((Number)(process.env.PORT));
	} else {
		await app.listen(3000);
	}
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AdminModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AdminModule);
	if (process.env.PORT) {
		await app.listen((Number)(process.env.PORT));
	} else {
		await app.listen(3000);
	}
}
bootstrap();

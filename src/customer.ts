import { NestFactory } from '@nestjs/core';
import { CustomerModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(CustomerModule);
	if (process.env.PORT) {
		await app.listen((Number)(process.env.PORT));
	} else {
		await app.listen(3000);
	}
}
bootstrap();

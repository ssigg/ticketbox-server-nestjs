import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventsCommonModule, EventsAdminModule } from './event/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Event],
      url: process.env.DATABASE_URL,
      synchronize: true,
    }),
    AuthModule,
    EventsCommonModule,
    EventsAdminModule
  ],
  controllers: [],
  components: [],
})
export class AppModule { }

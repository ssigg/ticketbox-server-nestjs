import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventsCommonModule, EventsAdminModule } from './event/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [ Event ],
      url: process.env.DATABASE_URL,
      synchronize: true,
    }),
    EventsCommonModule
  ],
  controllers: [ ],
  components: [ ],
})
export class CustomerModule { }

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [ Event ],
      url: process.env.DATABASE_URL,
      synchronize: true,
    }),
    EventsCommonModule,
    EventsAdminModule
  ],
  controllers: [ ],
  components: [ ],
})
export class AdminModule { }

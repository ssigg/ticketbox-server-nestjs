import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { Repository } from "typeorm/repository/Repository";

@Component()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>
    ) { }

    async findAll(): Promise<Event[]> {
        return await this.eventRepository.find();
    }

    async find(id: number): Promise<Event> {
        return await this.eventRepository.findOneById(id);
    }

    async delete(id: number): Promise<void> {
        return await this.eventRepository.delete({ id: id });
    }
}
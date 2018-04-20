import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event, EventDto } from "./event.entity";
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

    async findAllVisible(): Promise<Event[]> {
        return await this.eventRepository.find({ visible: true });
    }

    async find(id: number): Promise<Event> {
        return await this.eventRepository.findOneById(id);
    }

    async create(dto: EventDto): Promise<Event> {
        let event = await this.eventRepository.create();
        dto.updateModel(event);
        let savedEvent = await this.eventRepository.save(event);
        return savedEvent;
    }

    async update(id: number, dto: EventDto): Promise<Event> {
        let event = await this.eventRepository.findOneById(id);
        dto.updateModel(event);
        let savedEvent = await this.eventRepository.save(event);
        return savedEvent;
    }

    async delete(id: number): Promise<void> {
        return await this.eventRepository.delete({ id: id });
    }
}
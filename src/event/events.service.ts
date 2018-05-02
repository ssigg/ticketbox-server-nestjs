import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event, EventDto, EventWithBlocks } from "./event.entity";
import { Repository } from "typeorm/repository/Repository";
import { BlocksService } from "../block/blocks.service";
import { EventblocksService } from "../eventblock/eventblocks.service";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Component()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly eventblocksService: EventblocksService
    ) { }

    async findAll(): Promise<Event[]> {
        return await this.eventRepository.find();
    }

    async findAllVisible(): Promise<Event[]> {
        return await this.eventRepository.find({ visible: true });
    }

    async find(id: number): Promise<EventWithBlocks> {
        let event = await this.eventRepository.findOne(id);
        let thinMergedEventBlocks = await this.eventblocksService.getThinMergedEventblocks(event.id);
        return new EventWithBlocks(event, thinMergedEventBlocks);
    }

    async create(dto: EventDto): Promise<Event> {
        let event = await this.eventRepository.create();
        event.updateFromDto(dto);
        let savedEvent = await this.eventRepository.save(event);
        return savedEvent;
    }

    async update(id: number, dto: EventDto): Promise<Event> {
        let event = await this.eventRepository.findOne(id);
        event.updateFromDto(dto);
        let savedEvent = await this.eventRepository.save(event);
        return savedEvent;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.eventRepository.delete({ id: id });
    }
}
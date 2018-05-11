import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../event/event.entity';
import { Block, BlockDto } from '../block/block.entity';
import { Eventblock, EventblockDto, ThinMergedEventblockInterface, ThinMergedEventblock, MergedEventblock, MergedEventblockPart, ComparableMergedEventblockInterface } from './eventblock.entity';
import { Category } from '../category/category.entity';
import { Seat, AugmentedSeat, SeatState } from '../seat/seat.entity';
import { Reservation, OrderKind } from '../reservation/reservation.entity';
import { SeatsService } from '../seat/seats.service';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Component()
export class EventblocksService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        @InjectRepository(Eventblock)
        private readonly eventblockRepository: Repository<Eventblock>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        private readonly seatsService: SeatsService
    ) { }

    async create(dto: EventblockDto): Promise<Eventblock> {
        const eventblock = await this.eventblockRepository.create();
        eventblock.updateFromDto(dto);
        const savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async update(id: number, dto: EventblockDto): Promise<Eventblock> {
        const eventblock = await this.eventblockRepository.findOne({ id: id });
        eventblock.updateFromDto(dto);
        const savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.eventblockRepository.delete({ id: id });
    }

    async getThinMergedEventblocks(event_id: number): Promise<ThinMergedEventblockInterface[]> {
        const eventblocks = await this.eventblockRepository.find({ event_id: event_id });
        const augmentedEventblocks = await Promise.all(eventblocks.map(async eb => await this.augmentEventblockThin(eb)));
        const mergedEventblocks = augmentedEventblocks.reduce<ThinMergedEventblock[]>((pv, cv, ci, a) => this.appendBlock(pv, cv), []);
        return mergedEventblocks;
    }

    private async augmentEventblockThin(eventblock: Eventblock): Promise<ThinAugmentedEventblock> {
        const block = await this.blockRepository.findOne({ id: eventblock.block_id });
        return new ThinAugmentedEventblock(eventblock, block);
    }

    async getMergedEventblock(key: string, token: string): Promise<MergedEventblock> {
        const keyParts = key.split('-');
        const eventblocks = await Promise.all(keyParts.map(async p => await this.eventblockRepository.findOne({ id: parseInt(p, 10) })));
        if (!eventblocks.some(eb => eb === undefined)) {
            const augmentedEventblocks = await Promise.all(eventblocks.map(async eb => await this.augmentEventblockFull(eb, token)));
            const mergedEventblock = augmentedEventblocks.reduce<MergedEventblock[]>((pv, cv, ci, a) => this.appendBlock(pv, cv), [])[0];
            return mergedEventblock;
        } else {
            return undefined;
        }
    }

    private async augmentEventblockFull(eventblock: Eventblock, token: string): Promise<AugmentedEventblock> {
        const block = await this.blockRepository.findOne({ id: eventblock.block_id });
        const event = await this.eventRepository.findOne({ id: eventblock.event_id });
        const category = await this.categoryRepository.findOne({ id: eventblock.category_id });
        const seats = await this.seatRepository.find({ block_id: eventblock.block_id });
        const augmentedSeats = await Promise.all(seats.map(async s => await this.seatsService.augmentSeat(s, event, token)));
        return new AugmentedEventblock(eventblock, event, block, category, augmentedSeats);
    }

    private appendBlock<TMergedEventblock extends ComparableMergedEventblockInterface>(previousValue: TMergedEventblock[], newValue: AugmentedEventblockInterface<TMergedEventblock>): TMergedEventblock[]  {
        const block = newValue.block;
        const matching = previousValue.find(mb => this.canMerge(mb, block));
        if (matching !== undefined) { // we found a block to merge
            newValue.appendToMergedEventblock(matching);
        } else { // no block found, create a new one
            previousValue.push(newValue.createMergedEventblock());
        }
        return previousValue;
    }

    private canMerge(mergedEventblock: ComparableMergedEventblockInterface, block: Block): boolean {
        return mergedEventblock.name === block.name &&
               mergedEventblock.numbered === block.numbered &&
               mergedEventblock.seatplan_image_data_url === block.seatplan_image_data_url;
    }
}

interface AugmentedEventblockInterface<TMergedEventblock extends ComparableMergedEventblockInterface> {
    block: Block;
    createMergedEventblock(): TMergedEventblock;
    appendToMergedEventblock(mergedEventblock: TMergedEventblock): void;
}

class ThinAugmentedEventblock implements AugmentedEventblockInterface<ThinMergedEventblock> {
    constructor(eventBlock: Eventblock, block: Block) {
        this.eventblock = eventBlock;
        this.block = block;
    }
    eventblock: Eventblock;
    block: Block;

    createMergedEventblock(): ThinMergedEventblock {
        return new ThinMergedEventblock('' + this.eventblock.id, this.block.name, this.block.numbered, this.block.seatplan_image_data_url);
    }

    appendToMergedEventblock(mergedEventblock: ThinMergedEventblock): void {
        mergedEventblock.id += '-' + this.eventblock.id;
    }
}

class AugmentedEventblock implements AugmentedEventblockInterface<MergedEventblock> {
    constructor(eventblock: Eventblock, event: Event, block: Block, category: Category, seats: AugmentedSeat[]) {
        this.eventblock = eventblock;
        this.event = event;
        this.block = block;
        this.category = category;
        this.seats = seats;
    }
    eventblock: Eventblock;
    event: Event;
    block: Block;
    category: Category;
    seats: AugmentedSeat[];

    createMergedEventblock(): MergedEventblock {
        const parts = [ new MergedEventblockPart(this.eventblock.id, this.category, this.seats) ];
        return new MergedEventblock('' + this.eventblock.id, this.block.name, this.block.numbered, this.event, this.block.seatplan_image_data_url, parts);
    }

    appendToMergedEventblock(mergedEventblock: MergedEventblock): void {
        mergedEventblock.id += '-' + this.eventblock.id;
        mergedEventblock.parts.push(new MergedEventblockPart(this.eventblock.id, this.category, this.seats));
    }
}
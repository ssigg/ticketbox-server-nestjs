import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../event/event.entity";
import { Block, BlockDto } from "../block/block.entity";
import { Eventblock, EventblockDto, ThinMergedEventblockInterface, ThinMergedEventblock, MergedEventblock, MergedEventblockPart, ComparableMergedEventblockInterface } from "./eventblock.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";

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
        private readonly seatRepository: Repository<Seat>
    ) { }

    async create(dto: EventblockDto): Promise<Eventblock> {
        let eventblock = await this.eventblockRepository.create();
        dto.updateModel(eventblock);
        let savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async update(id: number, dto: EventblockDto): Promise<Eventblock> {
        let eventblock = await this.eventblockRepository.findOneById(id);
        dto.updateModel(eventblock);
        let savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async delete(id: number): Promise<void> {
        return await this.eventblockRepository.delete({ id: id });
    }

    async getThinMergedEventblocks(event_id: number): Promise<ThinMergedEventblockInterface[]> {
        let eventblocks = await this.eventblockRepository.find({ event_id: event_id });
        let augmentedEventblocks = await Promise.all(eventblocks.map(async eb => await this.augmentEventblockThin(eb)));
        let mergedEventblocks = augmentedEventblocks.reduce<ThinMergedEventblock[]>((pv, cv, ci, a) => this.appendBlock(pv, cv), []);
        return mergedEventblocks;
    }

    async getMergedEventblock(key: string): Promise<MergedEventblock> {
        let keyParts = key.split('-');
        let eventblocks = await Promise.all(keyParts.map(async p => await this.eventblockRepository.findOneById(p)));
        let augmentedEventblocks = await Promise.all(eventblocks.map(async eb => await this.augmentEventblockFull(eb)));
        let mergedEventblock = augmentedEventblocks.reduce<MergedEventblock[]>((pv, cv, ci, a) => this.appendBlock(pv, cv), [])[0];
        return mergedEventblock;
    }

    private async augmentEventblockThin(eventblock: Eventblock): Promise<ThinAugmentedEventblock> {
        let block = await this.blockRepository.findOneById(eventblock.block_id);
        return new ThinAugmentedEventblock(eventblock, block);
    }

    private async augmentEventblockFull(eventblock: Eventblock): Promise<AugmentedEventblock> {
        let block = await this.blockRepository.findOneById(eventblock.block_id);
        let event = await this.eventRepository.findOneById(eventblock.event_id);
        let category = await this.categoryRepository.findOneById(eventblock.category_id);
        let seats = await this.seatRepository.find({ block_id: eventblock.block_id });
        return new AugmentedEventblock(eventblock, event, block, category, seats);
    }

    private appendBlock<TMergedEventblock extends ComparableMergedEventblockInterface>(previousValue: TMergedEventblock[], newValue: AugmentedEventblockInterface<TMergedEventblock>): TMergedEventblock[]  {
        let block = newValue.block;
        let matching = previousValue.find(mb => this.canMerge(mb, block));
        if (matching !== undefined) { // we found a block to merge
            newValue.appendToMergedEventblock(matching);
        } else { // no block found, create a new one
            previousValue.push(newValue.createMergedEventblock());
        }
        return previousValue;
    }

    private canMerge(mergedEventblock: ComparableMergedEventblockInterface, block: Block): boolean {
        return mergedEventblock.name == block.name &&
               mergedEventblock.numbered == block.numbered &&
               mergedEventblock.seatplan_image_data_url == block.seatplan_image_data_url;
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
    constructor(eventblock: Eventblock, event: Event, block: Block, category: Category, seats: Seat[]) {
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
    seats: Seat[];

    createMergedEventblock(): MergedEventblock {
        let parts = [ new MergedEventblockPart(this.eventblock.id, this.category, this.seats) ];
        return new MergedEventblock('' + this.eventblock.id, this.block.name, this.block.numbered, this.event, this.block.seatplan_image_data_url, parts);
    }

    appendToMergedEventblock(mergedEventblock: MergedEventblock): void {
        mergedEventblock.id += '-' + this.eventblock.id;
        mergedEventblock.parts.push(new MergedEventblockPart(this.eventblock.id, this.category, this.seats));
    }
}
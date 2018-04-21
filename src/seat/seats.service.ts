
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { Seat, SeatDto } from "./seat.entity";
import { Component } from "@nestjs/common";

@Component()
export class SeatsService {
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>
    ) { }

    async findAllInBlock(blockId: number): Promise<Seat[]> {
        return await this.seatRepository.find({ block_id: blockId });
    }

    async create(dtos: SeatDto[]): Promise<Seat[]> {
        let savedSeats = await Promise.all(dtos.map(async dto => this.createOneSeat(dto)));
        return savedSeats;
    }

    async delete(id: number): Promise<void> {
        return await this.seatRepository.delete({ id: id });
    }

    private async createOneSeat(dto: SeatDto): Promise<Seat> {
        let seat = await this.seatRepository.create();
        dto.updateModel(seat);
        let savedSeat = await this.seatRepository.save(seat);
        return savedSeat;
    }
}
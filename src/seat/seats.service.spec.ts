import { Repository } from "typeorm";
import { SeatsService } from "./seats.service";
import { Seat, SeatDto } from "./seat.entity";

describe('SeatsService', () => {
    let seatRepository: Repository<Seat>;
    let seatsService: SeatsService;

    beforeEach(() => {
        seatRepository = new Repository<Seat>();
        seatsService = new SeatsService(seatRepository);
    });

    it('Fetches all seats of a block from repository', async () => {
        let seatMock = new Seat();
        let seatRepositoryFindSpy = spyOn(seatRepository, 'find').and.returnValue([seatMock]);
        let seats = await seatsService.findAllInBlock(1);
        expect(seatRepositoryFindSpy).toHaveBeenCalledWith({ block_id: 1 });
        expect(seats).toEqual([seatMock]);
    });

    it('Creates multiple seats with all properties set', async () => {
        let seatMock1 = new Seat();
        let seatMock2 = new Seat();

        let seatDtoMock1 = new SeatDto();
        seatDtoMock1.block_id = 1;
        seatDtoMock1.name = 's';
        seatDtoMock1.x0 = 1;
        seatDtoMock1.y0 = 2;
        seatDtoMock1.x1 = 3;
        seatDtoMock1.y1 = 4;
        seatDtoMock1.x2 = 5;
        seatDtoMock1.y2 = 6;
        seatDtoMock1.x3 = 7;
        seatDtoMock1.y3 = 8;
        let seatDtoMock2 = new SeatDto();
        seatDtoMock2.block_id = 1;
        seatDtoMock2.name = 's';
        seatDtoMock2.x0 = 1;
        seatDtoMock2.y0 = 2;
        seatDtoMock2.x1 = 3;
        seatDtoMock2.y1 = 4;
        seatDtoMock2.x2 = 5;
        seatDtoMock2.y2 = 6;
        seatDtoMock2.x3 = 7;
        seatDtoMock2.y3 = 8;

        let seatRepositoryCreateSpy = spyOn(seatRepository, 'create').and.returnValues(seatMock1, seatMock2);
        let seatRepositorySaveSpy = spyOn(seatRepository, 'save').and.returnValues(seatMock1, seatMock2);
        
        let seats = await seatsService.create([ seatDtoMock1, seatDtoMock2 ]);

        expect(seatRepositoryCreateSpy).toHaveBeenCalledTimes(2);
        expect(seatRepositorySaveSpy).toHaveBeenCalledTimes(2);
        expect(seats.length).toEqual(2);
        expect(seats).toContain(seatMock1);
        expect(seats).toContain(seatMock2);
    });

    it('Creates multiple seats with no optional properties set', async () => {
        let seatMock1 = new Seat();
        let seatMock2 = new Seat();

        let seatDtoMock1 = new SeatDto();
        seatDtoMock1.block_id = 1;
        seatDtoMock1.name = 's';
        
        let seatDtoMock2 = new SeatDto();
        seatDtoMock2.block_id = 1;
        seatDtoMock2.name = 's';

        let seatRepositoryCreateSpy = spyOn(seatRepository, 'create').and.returnValues(seatMock1, seatMock2);
        let seatRepositorySaveSpy = spyOn(seatRepository, 'save').and.returnValues(seatMock1, seatMock2);
        
        let seats = await seatsService.create([ seatDtoMock1, seatDtoMock2 ]);

        expect(seatRepositoryCreateSpy).toHaveBeenCalledTimes(2);
        expect(seatRepositorySaveSpy).toHaveBeenCalledTimes(2);
        expect(seats.length).toEqual(2);
        expect(seats).toContain(seatMock1);
        expect(seats).toContain(seatMock2);
    });

    it('Deletes seat with given id using repository', async () => {
        let seatRepositoryDeleteSpy = spyOn(seatRepository, 'delete');
        await seatsService.delete(1);
        expect(seatRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});
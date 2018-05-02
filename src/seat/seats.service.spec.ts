import { Repository } from "typeorm";
import { Event } from "../event/event.entity";
import { SeatsService } from "./seats.service";
import { Seat, SeatDto, SeatState } from "./seat.entity";
import { Reservation, OrderKind } from "../reservation/reservation.entity";

describe('SeatsService', () => {
    let seatRepository: Repository<Seat>;
    let reservationRepository: Repository<Reservation>;
    let seatsService: SeatsService;

    beforeEach(() => {
        seatRepository = new Repository<Seat>();
        reservationRepository = new Repository<Reservation>();
        seatsService = new SeatsService(seatRepository, reservationRepository);
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

        let seatDtoMock1 = {
            block_id: 1,
            name: 's',
            x0: 1,
            y0: 2,
            x1: 3,
            y1: 4,
            x2: 5,
            y2: 6,
            x3: 7,
            y3: 8
        };
        let seatDtoMock2 = {
            block_id: 1,
            name: 's',
            x0: 1,
            y0: 2,
            x1: 3,
            y1: 4,
            x2: 5,
            y2: 6,
            x3: 7,
            y3: 8
        };

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

        let seatDtoMock1 = {
            block_id: 1,
            name: 's'
        };
        
        let seatDtoMock2 = {
            block_id: 1,
            name: 's'
        };

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

    it('Augments a free seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(undefined);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.Free);
        expect(augmentedSeat.reservation_id).toEqual(undefined);
    });

    it('Augments an ordered seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.order_id = 2;
        reservationMock.order_kind = OrderKind.Reservation;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.Ordered);
        expect(augmentedSeat.reservation_id).toEqual(undefined);
    });

    it('Augments a boxoffice sold seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.order_id = 2;
        reservationMock.order_kind = OrderKind.BoxofficePurchase;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.Sold);
        expect(augmentedSeat.reservation_id).toEqual(undefined);
    });

    it('Augments a customer sold seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.order_id = 2;
        reservationMock.order_kind = OrderKind.CustomerPurchase;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.Sold);
        expect(augmentedSeat.reservation_id).toEqual(undefined);
    });

    it('Augments a reserved seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.order_id = null;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.Reserved);
        expect(augmentedSeat.reservation_id).toEqual(undefined);
    });

    it('Augments a self-reserved seat', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.token = 'token';
        reservationMock.order_id = null;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let augmentedSeat = await seatsService.augmentSeat(seatMock, eventMock, 'token');

        expect(augmentedSeat.seat).toEqual(seatMock);
        expect(augmentedSeat.state).toEqual(SeatState.ReservedByMyself);
        expect(augmentedSeat.reservation_id).toEqual(1);
    });

    it('Throws error when order kind is unknown', async () => {
        let seatMock = new Seat();
        let eventMock = new Event();
        let reservationMock = new Reservation();
        reservationMock.id = 1;
        reservationMock.token = 'token';
        reservationMock.order_id = 1;
        reservationMock.order_kind = undefined;
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        
        let rejected: boolean;
        await seatsService.augmentSeat(seatMock, eventMock, 'token').catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when order_kind is unknown.');
    });
});
import { Repository, IsNull, Not } from "typeorm";
import { Reservation, CreateReservationDto, UpdateReductionReservationDto, AddToOrderReservationDto, OrderKind, AugmentedReservation } from "./reservation.entity";
import { ReservationsService } from "./reservations.service";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";
import { UuidFactory } from "../utils/uuid.factory";

describe('ReservationsService', () => {
    let reservationRepository: Repository<Reservation>;
    let eventRepository: Repository<Event>;
    let seatRepository: Repository<Seat>;
    let categoryRepository: Repository<Category>;
    let reservationsService: ReservationsService;
    let uuidFactory: UuidFactory;

    beforeEach(() => {
        reservationRepository = new Repository<Reservation>();
        eventRepository = new Repository<Event>();
        seatRepository = new Repository<Seat>();
        categoryRepository = new Repository<Category>();
        uuidFactory = new UuidFactory();
        reservationsService = new ReservationsService(reservationRepository, eventRepository, seatRepository, categoryRepository, uuidFactory);
    });

    it('Fetches augmented reservations with given token from repository', async () => {
        let reservationMock = new Reservation();
        let eventMock = new Event();
        let seatMock = new Seat();
        let categoryMock = new Category();

        let reservationRepositoryFindSpy = spyOn(reservationRepository, 'find').and.returnValue([ reservationMock ]);
        let eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        let seatRepositoryfindOneSpy = spyOn(seatRepository, 'findOne').and.returnValue(seatMock);
        let categoryRespositoryfindOneSpy = spyOn(categoryRepository, 'findOne').and.returnValue(categoryMock);

        let augmentedReservations = await reservationsService.findMyReservations({ value: 'token', timestamp: 0, expirationTimestamp: 0 });

        expect(reservationRepositoryFindSpy).toHaveBeenCalledWith({ token: 'token' });
        expect(augmentedReservations.length).toEqual(1);
        expect(augmentedReservations[0].event).toEqual(eventMock);
        expect(augmentedReservations[0].seat).toEqual(seatMock);
        expect(augmentedReservations[0].category).toEqual(categoryMock);
    });

    it('Fetches ordered augmented reservations', async () => {
        let reservationMock = new Reservation();
        let eventMock = new Event();
        let seatMock = new Seat();
        let categoryMock = new Category();

        let reservationRepositoryFindSpy = spyOn(reservationRepository, 'find').and.returnValue([ reservationMock ]);
        let eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        let seatRepositoryfindOneSpy = spyOn(seatRepository, 'findOne').and.returnValue(seatMock);
        let categoryRespositoryfindOneSpy = spyOn(categoryRepository, 'findOne').and.returnValue(categoryMock);

        let augmentedReservations = await reservationsService.findAllOrderedReservations();

        expect(reservationRepositoryFindSpy).toHaveBeenCalledWith({ order_id: Not(IsNull()) });
        expect(augmentedReservations.length).toEqual(1);
        expect(augmentedReservations[0].event).toEqual(eventMock);
        expect(augmentedReservations[0].seat).toEqual(seatMock);
        expect(augmentedReservations[0].category).toEqual(categoryMock);
    });

    it('Creates reservation with given property values', async () => {
        let reservationMock = new Reservation();

        let eventMock = new Event();
        let seatMock = new Seat();
        let categoryMock = new Category();
        categoryMock.price = 20;
        categoryMock.price_reduced = 10;

        let reservationRepositoryCreateSpy = spyOn(reservationRepository, 'create').and.returnValue(reservationMock);
        let reservationRepositorySaveSpy = spyOn(reservationRepository, 'save').and.returnValue(reservationMock);
        let eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        let seatRepositoryfindOneSpy = spyOn(seatRepository, 'findOne').and.returnValue(seatMock);
        let categoryRespositoryfindOneSpy = spyOn(categoryRepository, 'findOne').and.returnValue(categoryMock);
        let augmentedReservation = await reservationsService.create(2, 1, 3, { value: 'token', timestamp: 0, expirationTimestamp: 0 });
        
        expect(reservationRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(reservationRepositorySaveSpy).toHaveBeenCalledWith(reservationMock);
        expect(eventRepositoryfindOneSpy).toHaveBeenCalledWith({ id: 2 });
        expect(seatRepositoryfindOneSpy).toHaveBeenCalledWith({ id: 1 });
        expect(categoryRespositoryfindOneSpy).toHaveBeenCalledWith({ id: 3 });

        expect(augmentedReservation.id).toEqual(reservationMock.id);
        expect(augmentedReservation.unique_id).toEqual(reservationMock.unique_id);
        expect(augmentedReservation.event).toEqual(eventMock);
        expect(augmentedReservation.seat).toEqual(seatMock);
        expect(augmentedReservation.category).toEqual(categoryMock);
        expect(augmentedReservation.isReduced).toEqual(false);
        expect(augmentedReservation.price).toEqual(categoryMock.price);
        expect(augmentedReservation.order_id).toEqual(undefined);
    });

    it('Updates reduction state of a reservation if reservation exists and is not ordered', async () => {
        let reservationMock = new Reservation();
        let updateReductionReservationDtoMock = {
            is_reduced: true
        };
        let reservationMockUpdateFromUpdateReductionDtoSpy = spyOn(reservationMock, 'updateFromUpdateReductionDto').and.callThrough();

        let eventMock = new Event();
        let seatMock = new Seat();
        let categoryMock = new Category();
        categoryMock.price = 20;
        categoryMock.price_reduced = 10;

        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        let reservationRepositorySaveSpy = spyOn(reservationRepository, 'save').and.returnValue(reservationMock);
        let eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        let seatRepositoryfindOneSpy = spyOn(seatRepository, 'findOne').and.returnValue(seatMock);
        let categoryRespositoryfindOneSpy = spyOn(categoryRepository, 'findOne').and.returnValue(categoryMock);

        let augmentedReservation = await reservationsService.updateReduction(1, { value: 'token', timestamp: 0, expirationTimestamp: 0 }, updateReductionReservationDtoMock);
        
        expect(reservationRepositoryFindOneSpy).toHaveBeenCalledWith({ id: 1, token: 'token', order_id: undefined });
        expect(reservationMockUpdateFromUpdateReductionDtoSpy).toHaveBeenCalledWith(updateReductionReservationDtoMock);
        expect(reservationRepositorySaveSpy).toHaveBeenCalledWith(reservationMock);

        expect(augmentedReservation.isReduced).toEqual(true);
        expect(augmentedReservation.price).toEqual(categoryMock.price_reduced);
    });

    it('Returns undefined when a not existing reservation is updated', async () => {
        let updateReductionReservationDtoMock = {
            is_reduced: true
        };

        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(undefined);
        let reservationRepositorySaveSpy = spyOn(reservationRepository, 'save');

        let reservation = await reservationsService.updateReduction(1, { value: 'token', timestamp: 0, expirationTimestamp: 0 }, updateReductionReservationDtoMock);
        
        expect(reservationRepositoryFindOneSpy).toHaveBeenCalledWith({ id: 1, token: 'token', order_id: undefined });
        expect(reservationRepositorySaveSpy).not.toHaveBeenCalled();
        expect(reservation).toEqual(undefined);
    });

    it('Adds the reservation to an order if reservation exists and is not ordered', async () => {
        let reservationMock = new Reservation();
        let addToOrderReservationDtoMock = {
            order_id: 1,
            order_kind: OrderKind.Reservation
        };
        let reservationMockUpdateFromAddToOrderDtoSpy = spyOn(reservationMock, 'updateFromAddToOrderDto').and.callThrough();
        
        let eventMock = new Event();
        let seatMock = new Seat();
        let categoryMock = new Category();

        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(reservationMock);
        let reservationRepositorySaveSpy = spyOn(reservationRepository, 'save').and.returnValue(reservationMock);
        let eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        let seatRepositoryfindOneSpy = spyOn(seatRepository, 'findOne').and.returnValue(seatMock);
        let categoryRespositoryfindOneSpy = spyOn(categoryRepository, 'findOne').and.returnValue(categoryMock);

        let augmentedReservation = await reservationsService.addToOrder(1, { value: 'token', timestamp: 0, expirationTimestamp: 0 }, addToOrderReservationDtoMock);
        
        expect(reservationRepositoryFindOneSpy).toHaveBeenCalledWith({ id: 1, token: 'token', order_id: undefined });
        expect(reservationMockUpdateFromAddToOrderDtoSpy).toHaveBeenCalledWith(addToOrderReservationDtoMock);
        expect(reservationRepositorySaveSpy).toHaveBeenCalledWith(reservationMock);
        
        expect(augmentedReservation.order_id).toEqual(1);
        expect(augmentedReservation.event).toEqual(eventMock);
        expect(augmentedReservation.seat).toEqual(seatMock);
        expect(augmentedReservation.category).toEqual(categoryMock);
    });

    it('Returns undefined when a not existing reservation is added to an order', async () => {
        let addToOrderReservationDtoMock = {
            order_id: 1,
            order_kind: OrderKind.Reservation
        };

        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValue(undefined);
        let reservationRepositorySaveSpy = spyOn(reservationRepository, 'save');

        let reservation = await reservationsService.addToOrder(1, { value: 'token', timestamp: 0, expirationTimestamp: 0 }, addToOrderReservationDtoMock);
        
        expect(reservationRepositoryFindOneSpy).toHaveBeenCalledWith({ id: 1, token: 'token', order_id: undefined });
        expect(reservationRepositorySaveSpy).not.toHaveBeenCalled();
        expect(reservation).toEqual(undefined);
    });

    it('Deletes reservation with given id using repository', async () => {
        let reservationRepositoryDeleteSpy = spyOn(reservationRepository, 'delete');
        await reservationsService.delete(1);
        expect(reservationRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});
import { ReservationsController, ReservationsExpirationTimestampController, ReservationsAdminController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AugmentedReservation } from './reservation.entity';
import { BasketService } from './basket.service';

describe('ReservationsController', () => {
    let basketService: BasketService;
    let reservationsController: ReservationsController;

    beforeEach(() => {
        basketService = new BasketService(null, null, null);
        reservationsController = new ReservationsController(basketService);
    });

    it('Fetches all reservations from reservations service', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2, 0);
        let basketServiceGetReservationsSpy = spyOn(basketService, 'getReservations').and.returnValue([ reservationMock ]);
        let reservations = reservationsController.findMine();
        expect(basketServiceGetReservationsSpy).toHaveBeenCalledTimes(1);
        expect(await reservations).toEqual([ reservationMock ]);
    });

    it('Creates a reservation for the given seat/event/category', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2, 0);
        let basketServiceAddReservationSpy = spyOn(basketService, 'addReservation').and.returnValue(reservationMock);
        let reservation = reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 });
        expect(basketServiceAddReservationSpy).toHaveBeenCalledWith(1, 2, 3);
        expect(await reservation).toEqual(reservationMock);
    });

    it('Throws HttpException when reservation cannot be created', async () => {
        let basketServiceAddReservationSpy = spyOn(basketService, 'addReservation').and.throwError('error');
        let rejected: boolean;
        await reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 }).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(basketServiceAddReservationSpy).toHaveBeenCalledWith(1, 2, 3);
    });

    it('Updates the reservation with the given id', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2, 0);
        let basketServiceUpdateReductionSpy = spyOn(basketService, 'updateReduction').and.returnValue(reservationMock);
        let reservation = reservationsController.updateReduction({ id: 1 }, { isReduced: true });
        expect(basketServiceUpdateReductionSpy).toHaveBeenCalledWith(1, true);
        expect(await reservation).toEqual(reservationMock);
    });

    it('Deletes a reservation using reservations service', () => {
        let basketServiceRemoveReservationSpy = spyOn(basketService, 'removeReservation');
        reservationsController.delete({ id: 1 });
        expect(basketServiceRemoveReservationSpy).toHaveBeenCalledTimes(1);
    });
});

describe('ReservationsExpirationTimestampController', () => {
    let basketService: BasketService;
    let reservationsController: ReservationsExpirationTimestampController;

    beforeEach(() => {
        basketService = new BasketService(null, null, null);
        reservationsController = new ReservationsExpirationTimestampController(basketService);
    });

    it('Returns the token expiration timestamp', async () => {
        let basketServiceGetExpirationTimestampInSeconds = spyOn(basketService, 'getExpirationTimestampInSeconds').and.returnValue(42);
        let timestamp = await reservationsController.getExpirationTimestamp();
        expect(basketServiceGetExpirationTimestampInSeconds).toHaveBeenCalledTimes(1);
        expect(timestamp.value).toEqual(42);
    });
});

describe('ReservationsAdminController', () => {
    let reservationsService: ReservationsService;
    let reservationsAdminController: ReservationsAdminController;

    beforeEach(() => {
        reservationsService = new ReservationsService(null, null, null, null, null);
        reservationsAdminController = new ReservationsAdminController(reservationsService);
    });

    it('Fetches all ordered reservations from reservations service', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2, 0);
        let reservationsServiceFindMineSpy = spyOn(reservationsService, 'findAllOrderedReservations').and.returnValue([ reservationMock ]);
        let reservations = reservationsAdminController.findAllOrdered();
        expect(reservationsServiceFindMineSpy).toHaveBeenCalled();
        expect(await reservations).toEqual([ reservationMock ]);
    });
});
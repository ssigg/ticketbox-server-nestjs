import { ReservationsController, ReservationsExpirationTimestampController, ReservationsAdminController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AugmentedReservation } from './reservation.entity';

describe('ReservationsController', () => {
    let reservationsService: ReservationsService;
    let reservationsController: ReservationsController;

    beforeEach(() => {
        reservationsService = new ReservationsService(null, null, null, null, null);
        reservationsController = new ReservationsController(reservationsService);
    });

    it('Fetches all reservations from reservations service', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceFindMineSpy = spyOn(reservationsService, 'findMyReservations').and.returnValue([ reservationMock ]);
        let reservations = reservationsController.findMine({ token: { value: 'token', timestamp: 0, expirationTimestamp: 0 } });
        expect(reservationsServiceFindMineSpy).toHaveBeenCalledWith({ value: 'token', timestamp: 0, expirationTimestamp: 0 });
        expect(await reservations).toEqual([ reservationMock ]);
    });

    it('Creates a reservation for the given seat/event/category', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.returnValue(reservationMock);
        let reservation = reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 }, { token: { value: 'token', timestamp: 0, expirationTimestamp: 0 } });
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(1, 2, 3, { value: 'token', timestamp: 0, expirationTimestamp: 0 });
        expect(await reservation).toEqual(reservationMock);
    });

    it('Throws HttpException when reservation cannot be created', async () => {
        let reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.throwError('error');
        let rejected: boolean;
        await reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 }, { token: { value: 'token', timestamp: 0, expirationTimestamp: 0 } }).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(1, 2, 3, { value: 'token', timestamp: 0, expirationTimestamp: 0 });
    });

    it('Updates the reservation with the given id', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceUpdateReductionSpy = spyOn(reservationsService, 'updateReduction').and.returnValue(reservationMock);
        let reservation = reservationsController.updateReduction({ id: 1 }, { is_reduced: true }, { token: { value: 'token', timestamp: 0, expirationTimestamp: 0 } });
        expect(reservationsServiceUpdateReductionSpy).toHaveBeenCalledWith(1, { value: 'token', timestamp: 0, expirationTimestamp: 0 }, { is_reduced: true });
        expect(await reservation).toEqual(reservationMock);
    });

    it('Deletes a reservation using reservations service', () => {
        let reservationsServiceDeleteSpy = spyOn(reservationsService, 'delete');
        reservationsController.delete({ id: 1 });
        expect(reservationsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});

describe('ReservationsExpirationTimestampController', () => {
    let reservationsController: ReservationsExpirationTimestampController;

    beforeEach(() => {
        reservationsController = new ReservationsExpirationTimestampController();
    });

    it('Returns the token expiration timestamp', () => {
        let timestamp = reservationsController.getExpirationTimestamp({ token: { value: 'token', timestamp: 0, expirationTimestamp: 42 } });
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
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceFindMineSpy = spyOn(reservationsService, 'findAllOrderedReservations').and.returnValue([ reservationMock ]);
        let reservations = reservationsAdminController.findAllOrdered();
        expect(reservationsServiceFindMineSpy).toHaveBeenCalled();
        expect(await reservations).toEqual([ reservationMock ]);
    });
});
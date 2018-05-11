import { SeatsService } from './seats.service';
import { SeatsAdminController } from './seats.controller';
import { Seat } from './seat.entity';

describe('SeatsAdminController', () => {
    let seatsService: SeatsService;
    let seatsAdminController: SeatsAdminController;

    beforeEach(() => {
        seatsService = new SeatsService(null, null);
        seatsAdminController = new SeatsAdminController(seatsService);
    });

    it('Fetches all seats from seats service', async () => {
        const seatMock = new Seat();
        const seatsServiceFindAllSpy = spyOn(seatsService, 'findAllInBlock').and.returnValue([ seatMock ]);
        const categories = seatsAdminController.findAll('?block_id=1');
        expect(seatsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await categories).toEqual([ seatMock ]);
    });

    it('Creates seats using seats service', async () => {
        const seatMock1 = new Seat();
        const seatMock2 = new Seat();
        const categoriesServiceCreateSpy = spyOn(seatsService, 'create').and.returnValue([ seatMock1, seatMock2 ]);
        const body = [{ block_id: 1, name: 'name1' }, { block_id: 1, name: 'name2' }];
        const seats = await seatsAdminController.create(body);
        expect(categoriesServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(seats.length).toEqual(2);
        expect(seats).toContain(seatMock1);
        expect(seats).toContain(seatMock2);
    });

    it('Deletes a seat using seats service', () => {
        const seatsServiceDeleteSpy = spyOn(seatsService, 'delete');
        seatsAdminController.delete({ id: 1 });
        expect(seatsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});
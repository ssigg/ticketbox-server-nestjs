import { UuidFactory } from './uuid.factory';

describe('UuidFactory', () => {
    let uuidFactory: UuidFactory;

    beforeEach(() => {
        uuidFactory = new UuidFactory();
    });

    it('Returns different tokens', async () => {
        const token1 = uuidFactory.create();
        const token2 = uuidFactory.create();
        expect(token1).not.toEqual(token2);
    });
});
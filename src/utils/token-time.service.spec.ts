import { TokenTimeService } from './token-time.service';

describe('TokenTimeService', () => {
    let tokenTimeService: TokenTimeService;

    beforeEach(() => {
        tokenTimeService = new TokenTimeService();
    });

    it('Returns standard token expiration duration', async () => {
        const expirationDuration = tokenTimeService.getTokenExpirationDuration();
        expect(expirationDuration).toEqual(600);
    });

    it('Returns the current timestamp', async () => {
        const expectedNow1 = Math.round(Date.now() / 1000);
        const now = tokenTimeService.getNow();
        const expectedNow2 = Math.round(Date.now() / 1000);

        expect(now).toBeGreaterThanOrEqual(expectedNow1);
        expect(now).toBeLessThanOrEqual(expectedNow2);
    });

    it('Returns the purge timestamp', async () => {
        const expectedNow1 = Math.round(Date.now() / 1000);
        const now = tokenTimeService.getPurgeTimestamp();
        const expectedNow2 = Math.round(Date.now() / 1000);

        expect(now).toBeGreaterThanOrEqual(expectedNow1 - 600);
        expect(now).toBeLessThanOrEqual(expectedNow2 - 600);
    });
});
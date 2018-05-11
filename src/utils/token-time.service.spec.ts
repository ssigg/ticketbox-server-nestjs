import { TokenTimeService } from './token-time.service';

describe('TokenTimeService', () => {
    let tokenTimeService: TokenTimeService;

    beforeEach(() => {
        tokenTimeService = new TokenTimeService();
    });

    it('Returns standard token expiration duration', async () => {
        let expirationDuration = tokenTimeService.getTokenExpirationDuration();
        expect(expirationDuration).toEqual(600);
    });

    it('Returns the current timestamp', async () => {
        let expectedNow1 = Math.round(Date.now() / 1000);
        let now = tokenTimeService.getNow();
        let expectedNow2 = Math.round(Date.now() / 1000);

        expect(now).toBeGreaterThanOrEqual(expectedNow1);
        expect(now).toBeLessThanOrEqual(expectedNow2);
    });

    it('Returns the purge timestamp', async () => {
        let expectedNow1 = Math.round(Date.now() / 1000);
        let now = tokenTimeService.getPurgeTimestamp();
        let expectedNow2 = Math.round(Date.now() / 1000);

        expect(now).toBeGreaterThanOrEqual(expectedNow1 - 600);
        expect(now).toBeLessThanOrEqual(expectedNow2 - 600);
    });
});
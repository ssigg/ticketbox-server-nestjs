import { Component } from "@nestjs/common";

@Component()
export class TokenTimeService {
    private readonly expirationDuration: number = parseInt(process.env.TOKEN_EXPIRATION_DURATION_IN_SECONDS || '600');
    
    getTokenExpirationDuration(): number {
        return this.expirationDuration;
    }

    getNow(): number {
        return Math.round(Date.now() / 1000);
    }

    getPurgeTimestamp(): number {
        return Math.round(Date.now() / 1000) - this.expirationDuration;
    }
}
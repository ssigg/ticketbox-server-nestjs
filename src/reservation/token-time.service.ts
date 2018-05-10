import { Component } from "@nestjs/common";

@Component()
export class TokenTimeService {
    getTokenExpirationDuration(): number {
        let expirationDurationInSecondsString = process.env.TOKEN_EXPIRATION_DURATION_IN_SECONDS || '600';
        return parseInt(expirationDurationInSecondsString);
    }

    getNow(): number {
        return Math.round(Date.now() / 1000);
    }
}
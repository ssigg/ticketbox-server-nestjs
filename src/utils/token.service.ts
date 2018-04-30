import { Component } from "@nestjs/common";
import { UuidFactory } from "./uuid.factory";

@Component()
export class TokenService {
    tokenExpirationDurationInSeconds: number;

    constructor(private readonly uuidFactory: UuidFactory) {
        const expirationDurationInSecondsString = process.env.TOKEN_EXPIRATION_DURATION_IN_SECONDS || '600';
        this.tokenExpirationDurationInSeconds = parseInt(expirationDurationInSecondsString);
    }

    getToken(): Token {
        return new Token(this.uuidFactory.create(), Date.now(), this.tokenExpirationDurationInSeconds);
    }
}

export class Token {
    constructor(value: string, timestamp: number, tokenExpirationDurationInMilliseconds: number) {
        this.value = value;
        this.timestamp = timestamp;
        this.expirationTimestamp = timestamp + tokenExpirationDurationInMilliseconds;
    }
    value: string;
    timestamp: number;
    expirationTimestamp: number;
}
import * as uuidv4 from 'uuid/v4';
import { Component } from '@nestjs/common';

@Component()
export class UuidFactory {
    create(): string {
        return uuidv4();
    }
}
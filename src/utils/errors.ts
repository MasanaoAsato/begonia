import { ErrorFactory } from '@praha/error-factory';

export class ValueObjectError extends ErrorFactory({
    name: 'ValueObjectError',
    message: 'Value object error',
}) { }

export class CreateTaskError extends ErrorFactory({
    name: 'CreateTaskError',
    message: 'Failed to create task',
}) { }

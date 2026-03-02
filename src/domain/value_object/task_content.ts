import { ValueObjectError } from "../../utils/errors";

export class TaskContent {
    private readonly _value: string;

    constructor(value: string) {
        if (value.length === 0) {
            throw new ValueObjectError();
        }
        if (value.length > 65535) {
            throw new ValueObjectError();
        }
        this._value = value;
    }

    value(): string {
        return this._value;
    }
}

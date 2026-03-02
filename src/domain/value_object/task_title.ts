import { ValueObjectError } from "../../utils/errors";

export class TaskTitle {
    private readonly _value: string;

    constructor(value: string) {
        if (value.length === 0) {
            throw new ValueObjectError();
        }
        if (value.length > 255) {
            throw new ValueObjectError();
        }
        this._value = value;
    }

    equals(other: TaskTitle): boolean {
        return this._value === other._value;
    }

    value(): string {
        return this._value;
    }
}

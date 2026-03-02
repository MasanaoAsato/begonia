import { ValueObjectError } from "../../utils/errors";

export class TaskId {
    private readonly _value: string;

    constructor(value: string) {
        if (value.length !== 26) {
            throw new ValueObjectError();
        }
        this._value = value;
    }

    value(): string {
        return this._value;
    }
}

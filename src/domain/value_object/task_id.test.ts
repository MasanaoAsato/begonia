import { describe, it, expect } from "vitest";
import { TaskId } from "./task_id";
import { ulid } from "ulid";
import { ValueObjectError } from "../../utils/errors";

describe("TaskId", () => {
	it("create TaskId valid", () => {
		const id = ulid();
		const taskId = new TaskId(id);
		expect(taskId.value()).toBe(id);
	});

	it("create TaskId invalid", () => {
		const id = "test title";
		expect(() => new TaskId(id)).toThrow(ValueObjectError);
	});
});

import { describe, it, expect } from "vitest";
import { TaskTitle } from "./task_title";
import { ValueObjectError } from "../../utils/errors";

describe("TaskTitle", () => {
	it("create TaskTitle valid", () => {
		const title = "test title";
		const taskTitle = new TaskTitle(title);
		expect(taskTitle.value()).toBe(title);
	});

	it("task title 0 length error", () => {
		expect(() => new TaskTitle("")).toThrow(ValueObjectError);
	});

	it("task title 256 length error", () => {
		expect(() => new TaskTitle("a".repeat(256))).toThrow(ValueObjectError);
	});
});

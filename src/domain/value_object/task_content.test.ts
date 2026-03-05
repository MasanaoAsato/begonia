import { describe, it, expect } from "vitest";
import { TaskContent } from "./task_content";
import { ValueObjectError } from "../../utils/errors";

describe("TaskContent", () => {
	it("create TaskContent valid", () => {
		const contest = "test_content";
		const taskContent = new TaskContent(contest);
		expect(taskContent.value()).toBe(contest);
	});

	it("task content 0 length error", () => {
		expect(() => new TaskContent("")).toThrow(ValueObjectError);
	});

	it("task content 65536 length error", () => {
		expect(() => new TaskContent("a".repeat(65536))).toThrow(ValueObjectError);
	});
});

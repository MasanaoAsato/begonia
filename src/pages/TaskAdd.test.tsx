import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskAdd } from "./TaskAdd";
import userEvent from "@testing-library/user-event";
import { createTask } from "../api/client";

vi.mock("../api/client");

describe("TaskAdd", () => {
	it("タイトルとコンテンツを入力してボタンを押せる", async () => {
		render(<TaskAdd />);
		const user = userEvent.setup();

		// input要素を取得して文字を入力する
		await user.type(
			screen.getByRole("textbox", { name: "title" }),
			"test title",
		);
		await user.type(
			screen.getByRole("textbox", { name: "content" }),
			"test content",
		);

		// ボタンをクリックする
		await user.click(screen.getByRole("button", { name: "Add Task" }));

		// createTask が呼ばれたことを確認する
		expect(createTask).toHaveBeenCalledOnce();
		expect(createTask).toHaveBeenCalledWith({
			title: "test title",
			content: "test content",
		});
	});
});

import { useState } from "react";
import { createTask } from "../api/client";
import { TaskTitle } from "../domain/value_object/task_title";
import { TaskContent } from "../domain/value_object/task_content";

export const TaskAdd = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			new TaskTitle(title);
			new TaskContent(content);
			await createTask({ title, content });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container">
			<h1>Add Task</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<button type="submit">Add Task</button>
			</form>
		</div>
	);
};

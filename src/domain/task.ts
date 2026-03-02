import type { TaskContent } from "./value_object/task_content";
import type { TaskId } from "./value_object/task_id";
import type { TaskTitle } from "./value_object/task_title";

export interface Task {
	id: TaskId;
	title: TaskTitle;
	content: TaskContent;
}

export interface CreateTaskRequest {
	title: string;
	content: string;
}

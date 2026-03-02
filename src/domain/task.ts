import { TaskContent } from "./value_object/task_content";
import { TaskId } from "./value_object/task_id";
import { TaskTitle } from "./value_object/task_title";

export interface Task {
    id: TaskId;
    title: TaskTitle;
    content: TaskContent;
}



export interface CreateTaskRequest {
    title: string;
    content: string;
}

import { CreateTaskError } from "../utils/errors";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createTask = async (data: { title: string; content: string }) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new CreateTaskError();
	}

	return response.json();
};

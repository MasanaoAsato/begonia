import { describe, it, expect, vi } from 'vitest';
import { createTask } from './client';
import { ulid } from 'ulid';


describe("createTask", () => {
    it("create task valid", async () => {

        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({
                id: ulid(),
                title: "test title",
                content: "test content",
            })
        } as Response)

        const requestData = {
            title: "test title",
            content: "test content",
        }

        const task = await createTask(requestData)

        expect(task).toBeDefined();
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/api/v1/tasks"),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(requestData)
            })

        );
    })
})

import { z } from 'zod';

export const newTaskSchema = z.object({
	taskTitle: z.string().min(2).max(50).nonempty(),
	link: z.string().url().optional().or(z.literal('')),
	content: z.string().min(2).max(200).optional().or(z.literal('')),
});

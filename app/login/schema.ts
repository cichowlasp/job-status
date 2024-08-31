import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().min(2).max(50),
	password: z.string().min(2).max(50),
});

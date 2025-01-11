import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email().min(4).max(50),
	password: z.string().min(6).max(50),
});

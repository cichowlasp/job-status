import { z } from 'zod';

export const registerSchema = z
	.object({
		name: z.string().min(4).max(12),
		email: z.string().min(2).max(50),
		password: z.string().min(7).max(50),
		confirmPassword: z.string().min(7).max(50),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword'],
			});
		}
	});

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { registerSchema } from './schema';

export async function register({
	email,
	password,
	name,
}: z.infer<typeof registerSchema>) {
	const supabase = await createClient();
	// type-casting here for convenience
	// in practice, you should validate your inputs

	const data = {
		email,
		password,
		options: {
			data: {
				name,
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		return error;
	}

	revalidatePath('/register', 'layout');
	redirect(`/login/?email=${email}`);
}

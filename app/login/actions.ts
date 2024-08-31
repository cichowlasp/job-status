'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { loginSchema } from './schema';

export async function login(values: z.infer<typeof loginSchema>) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: values.email,
		password: values.password,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect('/error');
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

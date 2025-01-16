'use client';

import { z } from 'zod';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
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
		console.error(error);
		redirect('/error');
	}

	redirect('/private');
}

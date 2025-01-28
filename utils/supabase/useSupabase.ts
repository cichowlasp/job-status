'use client';

import { createClient } from './client';
import { redirect } from 'next/navigation';

export const supabase = createClient();

export const signOut = async () => {
	const { error } = await supabase.auth.signOut({ scope: 'global' });
	if (error) {
		return error;
	}
	redirect('/');
};

export const signOutLocal = async () => {
	await supabase.auth.signOut({ scope: 'local' });
	redirect('/');
};

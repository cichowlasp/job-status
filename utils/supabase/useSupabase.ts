'use client';

import { createClient } from './client';
import { redirect } from 'next/navigation';

export const supabase = createClient();

export const signOut = async () => {
	await supabase.auth.signOut();
	redirect('/');
};

'use client';

import { createClient } from './client';

export const supabase = createClient();

export const signOut = async () => {
	await supabase.auth.signOut();
};

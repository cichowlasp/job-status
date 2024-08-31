import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import { ThemeSwitcher } from './theme-switch';

async function Navbar() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/login');
	}

	return (
		<nav className='w-full h-16 bg-background border-accent-foreground-foreground border-b-2 flex items-center px-6 justify-between'>
			<Button variant='link'>
				<Link
					className='text-xl'
					href={error || !data?.user ? '/' : 'private'}>
					Job status
				</Link>
			</Button>
			<div className='flex gap-4'>
				{error || !data?.user ? (
					<div className='flex gap-4'>
						<Button variant='outline'>
							<Link className='text-md min-w-16' href='/login'>
								Login
							</Link>
						</Button>
						<Button>
							<Link className='text-md min-w-16' href='/register'>
								Register
							</Link>
						</Button>
					</div>
				) : (
					<div>
						<Button>
							<CircleUserRound className='mr-2 h-4 w-4' />
							{data.user.user_metadata['name']}
						</Button>
					</div>
				)}
				<ThemeSwitcher />
			</div>
		</nav>
	);
}

export default Navbar;

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { CircleUserRound, LogOut } from 'lucide-react';
import { ThemeSwitcher } from './theme-switch';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from './auth-provider';
import { signOut } from '@/utils/supabase/useSupabase';
import { useRouter } from 'next/navigation';

function Navbar() {
	const data = useAuth();
	const router = useRouter();

	return (
		<nav className='w-full h-16 bg-background border-accent-foreground-foreground border-b-2 flex items-center px-6 justify-between'>
			<Button className='pl-0' variant='link'>
				<Link className='text-xl' href={!data?.user ? '/' : 'private'}>
					Job status
				</Link>
			</Button>
			<div className='flex gap-4'>
				{!data?.user ? (
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button>
									<CircleUserRound className='mr-2 h-4 w-4' />
									{data.user.user_metadata['name']}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuItem
									className=''
									onClick={async () => {
										await signOut();
										router.push('/');
									}}>
									<Button variant='link'>
										<LogOut className='mr-2 h-4 w-4' />
										Logout
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
				<ThemeSwitcher />
			</div>
		</nav>
	);
}

export default Navbar;

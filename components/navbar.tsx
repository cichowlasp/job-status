'use client';

import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { CircleUserRound, LogOut, ClipboardList } from 'lucide-react';
import { ThemeSwitcher } from './theme-switch';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from './auth-provider';
import { signOut } from '@/utils/supabase/useSupabase';
import { useRouter, usePathname } from 'next/navigation';

function Navbar() {
	const data = useAuth();
	const router = useRouter();
	const pathName = usePathname();

	return (
		<nav className='w-full max-w-full overflow-hidden h-16 bg-background border-accent-foreground-foreground border-b-2 flex items-center px-6 justify-between'>
			<Button asChild variant='link'>
				<Link
					className='text-xl'
					href={!data?.user?.id ? '/' : 'private'}>
					Task list
				</Link>
			</Button>
			<div className='flex gap-4'>
				{!data?.user ? (
					<>
						<div className='hidden sm:flex gap-4'>
							<Button variant='secondary'>
								<Link
									className='text-md min-w-16'
									href='/login'>
									Login
								</Link>
							</Button>
							<Button variant='default'>
								<Link
									className='text-md min-w-16'
									href='/register'>
									Register
								</Link>
							</Button>
						</div>
						<div className='flex sm:hidden'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size='icon'>
										<CircleUserRound className='h-[1.2rem] w-[1.2rem]' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										onClick={() => router.push('/login')}>
										<Button
											className='w-full'
											variant='outline'>
											Login
										</Button>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											router.push('/register')
										}>
										<Button className='w-full'>
											Register
										</Button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</>
				) : (
					<div>
						{!(pathName === '/private') && (
							<>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button aria-label='user'>
											<CircleUserRound className='mr-2 h-4 w-4' />
											{data.user.user_metadata['name']}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuItem
											className=''
											onClick={async () => {
												await signOut();
											}}>
											<Button variant='link'>
												<LogOut className='mr-2 h-4 w-4' />
												Logout
											</Button>
										</DropdownMenuItem>
										<DropdownMenuItem
											className=''
											onClick={async () => {
												router.push('/private');
											}}>
											<Button variant='link'>
												<ClipboardList className='mr-2 h-4 w-4' />
												My Tasks
											</Button>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<ThemeSwitcher />
							</>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}

export default Navbar;

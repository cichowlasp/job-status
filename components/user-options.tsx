'use client';

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	LayoutGrid,
	List,
	Moon,
	Plus,
	Sun,
	Laptop,
	ChevronDown,
	ClipboardList,
	Columns3,
	Home,
	Archive,
	Settings,
	LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut, supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from './auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useView } from './view-provider';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function UserOptions() {
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const auth = useAuth();
	const pathname = usePathname();
	const {
		view,
		setView,
		setIsNewDialogOpen,
		setIsColumnDialogOpen,
		setMobileMenu,
	} = useView();
	return (
		<>
			<div className='flex items-center justify-between mt-6 lg:mt-0'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className='w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300'
							size='lg'>
							<Plus className='mr-2 h-5 w-5' />
							Create
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='center'
						className='w-56 rounded-xl p-2'>
						<DropdownMenuItem
							onClick={() => {
								setIsNewDialogOpen(true);
								setMobileMenu(false);
							}}
							className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
							<ClipboardList className='h-4 w-4' />
							<span>Task</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setIsColumnDialogOpen(true);
								setMobileMenu(false);
							}}
							className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
							<Columns3 className='h-4 w-4' />
							<span>Column</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Separator className='my-6' />
			<div className='space-y-4'>
				<ToggleGroup
					type='single'
					value={view}
					className='grid w-full grid-cols-2 gap-2'>
					<ToggleGroupItem
						onClick={async (event) => {
							setView(
								(event.target as HTMLElement).innerText ===
									'Board'
									? 'Board'
									: 'List'
							);
							const { error } = await supabase
								.from('view')
								.update({
									view: (event.target as HTMLElement)
										.innerText,
								})
								.eq('user_id', auth?.user?.id);
							if (error) {
								console.log(error);
							}
						}}
						value='Board'
						aria-label='Toggle board view'
						className='flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200 data-[state=on]:bg-primary/10 data-[state=on]:text-primary'>
						<LayoutGrid className='h-5 w-5' />
						Board
					</ToggleGroupItem>
					<ToggleGroupItem
						value='List'
						onClick={async (event) => {
							setView(
								(event.target as HTMLElement).innerText ===
									'Board'
									? 'Board'
									: 'List'
							);
							const { error } = await supabase
								.from('view')
								.update({
									view: (event.target as HTMLElement)
										.innerText,
								})
								.eq('user_id', auth?.user?.id);
							if (error) {
								console.log(error);
							}
						}}
						aria-label='Toggle list view'
						className='flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200 data-[state=on]:bg-primary/10 data-[state=on]:text-primary'>
						<List className='h-5 w-5' />
						List
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div>
				<Link
					onClick={() => {
						setMobileMenu(false);
					}}
					className={`p-4 w-full flex items-center border rounded-xl mt-4 transition-all duration-200 ${
						pathname === '/private'
							? 'bg-primary/10 text-primary border-primary/20'
							: 'hover:bg-secondary'
					}`}
					href={'/private'}>
					<Home className='h-[1rem] w-[1rem] mx-2' /> Home
				</Link>
				<Link
					onClick={() => {
						setMobileMenu(false);
					}}
					className={`p-4 w-full flex items-center border rounded-xl mt-4 transition-all duration-200 ${
						pathname === '/private/archived'
							? 'bg-primary/10 text-primary border-primary/20'
							: 'hover:bg-secondary'
					}`}
					href={'/private/archived'}>
					<Archive className='h-[1rem] w-[1rem] mx-2' /> Archived
				</Link>
			</div>

			<div className='mt-auto space-y-3 lg:mb-0 mb-6'>
				<Separator className='my-6' />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='w-full justify-between gap-3 rounded-xl px-4 py-6 text-base hover:bg-primary/5'>
							<div className='flex items-center gap-3'>
								{theme === 'light' && (
									<Sun className='h-5 w-5' />
								)}
								{theme === 'dark' && (
									<Moon className='h-5 w-5' />
								)}
								{theme === 'system' && (
									<Laptop className='h-5 w-5' />
								)}
								<span className='capitalize'>
									{theme} Theme
								</span>
							</div>
							<ChevronDown className='h-4 w-4 opacity-50' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='center'
						className='w-56 rounded-xl p-2'>
						<DropdownMenuItem
							onClick={() => setTheme('light')}
							className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
							<Sun className='h-4 w-4' />
							<span>Light</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setTheme('dark')}
							className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
							<Moon className='h-4 w-4' />
							<span>Dark</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setTheme('system')}
							className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
							<Laptop className='h-4 w-4' />
							<span>System</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='w-full justify-start gap-3 rounded-xl px-4 py-6 text-base hover:bg-primary/5'>
							<Avatar className='h-9 w-9 border-2 border-primary/20'>
								<AvatarImage src='/' />
								<AvatarFallback>
									{auth?.user?.user_metadata['name'][0]}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col items-start'>
								<span className='text-sm font-medium'>
									{auth?.user?.user_metadata['name']}
								</span>
								<span className='text-xs text-muted-foreground'>
									{auth.user?.email}
								</span>
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='center'
						className='w-56 rounded-xl p-2'>
						<DropdownMenuLabel className='px-2 py-1.5 text-xs font-normal text-muted-foreground'>
							My Account
						</DropdownMenuLabel>
						<DropdownMenuSeparator className='my-2 opacity-50' />
						<DropdownMenuItem
							onClick={() => {
								router.push('/private/settings');
								setMobileMenu(false);
							}}
							className='rounded-lg px-2 py-1.5'>
							<Settings className='mr-2 h-4 w-4' />
							Settings
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={async () => {
								await signOut();
							}}
							className='rounded-lg px-2 py-1.5 text-red-500 dark:text-red-400'>
							<LogOut className='mr-2 h-4 w-4' />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}

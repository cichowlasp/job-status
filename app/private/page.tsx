'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';
import { useCallback, useEffect, useState } from 'react';
import { signOut, supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from '@/components/auth-provider';
import Loading from '@/components/Loading';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
	ChevronUp,
} from 'lucide-react';
import { NewTaskDialog } from '@/components/NewTaskDialog';
import { NewColumnDialog } from '@/components/NewColumnDialog';
import { subscribeBoard, subscribeTasks, subscribeView } from './actions';
import { TaskList } from '@/components/List';
import { TaskDetailModal } from '@/components/TaskDetailsModal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export interface Column {
	id: string;
	title: string;
	user_id: string;
	position: number;
}

export default function PrivatePage() {
	const router = useRouter();
	const auth = useAuth();
	const searchParams = useSearchParams();
	const { theme, setTheme } = useTheme();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [board, setBoard] = useState<Column[]>([]);
	const [loading, setLoading] = useState(true);
	const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
	const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
	const [view, setView] = useState<'Board' | 'List'>('Board');
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [mobileMenu, setMobileMenu] = useState(false);

	useEffect(() => {
		if (!auth.user) {
			router.push('/login'); // Redirect to login page if user is not authenticated
		}
	}, [auth.user, router]);

	const fetchTasks = useCallback(async () => {
		if (!auth.user?.id) return;
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', auth.user?.id);
		if (error) {
			console.error(error);
			return;
		}
		setTasks(data as Task[]);
	}, [auth.user?.id]);

	const fetchBoard = useCallback(async () => {
		if (!auth.user?.id) return;
		const { data, error } = await supabase
			.from('kanban_columns')
			.select('*')
			.eq('user_id', auth.user?.id)
			.order('position');

		console.log(data);
		if (error) {
			console.error(error);
			return;
		}
		setBoard(data as Column[]);
	}, [auth.user?.id, setBoard]);

	const fetchView = useCallback(async () => {
		if (!auth.user?.id) return;
		const { data, error } = await supabase
			.from('view')
			.select()
			.eq('user_id', auth.user?.id);
		if (error) {
			console.error(error);
			return;
		}
		setView(data[0]?.view || 'Board');
	}, [auth.user?.id, setView]);

	useEffect(() => {
		const fetchData = async () => {
			await fetchTasks();
			await fetchBoard();
			await fetchView();
			setLoading(false);
		};
		fetchData();
	}, [fetchTasks, fetchBoard, fetchView]);

	useEffect(() => {
		if (!auth.user?.id) return;
		const tasksChannel = subscribeTasks(setTasks, auth?.user?.id);
		const columnsChannel = subscribeBoard(setBoard, auth?.user?.id);
		const viewChannel = subscribeView(setView, auth?.user?.id);

		return () => {
			supabase.removeChannel(tasksChannel);
			supabase.removeChannel(columnsChannel);
			supabase.removeChannel(viewChannel);
		};
	}, [auth.user?.id]);

	useEffect(() => {
		const taskId = searchParams.get('taskId');
		if (taskId) {
			const task = tasks.find((t: Task) => t.id == taskId);
			if (task) {
				setSelectedTask(task);
			}
		}
	}, [searchParams, tasks]);

	const openTaskDetail = (task: Task) => {
		setSelectedTask(task);
		router.push(`private/?taskId=${task.id}`, undefined);
	};

	const closeTaskDetail = () => {
		setSelectedTask(null);
		router.push('/private', undefined);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<section className='px-6 lg:pl-0 py-0 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden flex relative'>
			<div className='mr-6 p-6 flex-col hidden lg:flex h-full md:w-64 max-h-full items-center bg-background border-r'>
				<div className='flex items-center justify-between'>
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
								onClick={() => setIsNewDialogOpen(true)}
								className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
								<ClipboardList className='h-4 w-4' />
								<span>Task</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setIsColumnDialogOpen(true)}
								className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
								<Columns3 className='h-4 w-4' />
								<span>Column</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Separator className='my-6 opacity-50' />

				<div className='space-y-4'>
					<ToggleGroup
						type='single'
						value={view}
						className='grid w-full grid-cols-2 gap-2'>
						<ToggleGroupItem
							onClick={async (event) => {
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

				<div className='mt-auto space-y-3'>
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
							align='end'
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
							align='end'
							className='w-56 rounded-xl p-2'>
							<DropdownMenuLabel className='px-2 py-1.5 text-xs font-normal text-muted-foreground'>
								My Account
							</DropdownMenuLabel>
							<DropdownMenuSeparator className='my-2 opacity-50' />
							<DropdownMenuItem
								onClick={async () => {
									await signOut();
								}}
								className='rounded-lg px-2 py-1.5 text-red-500 dark:text-red-400'>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			{auth?.user?.id ? (
				<>
					<NewTaskDialog
						open={isNewDialogOpen}
						setOpen={setIsNewDialogOpen}
						userId={auth?.user?.id}
						board={board}
					/>
					<NewColumnDialog
						open={isColumnDialogOpen}
						setOpen={setIsColumnDialogOpen}
						userId={auth?.user?.id}
						board={board}
					/>
				</>
			) : null}{' '}
			{view === 'Board' ? (
				<div className='w-full flex justify-center items-center pt-12 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<KanbanBoard
						tasks={tasks}
						openTaskDetail={openTaskDetail}
						columns={board}
					/>
				</div>
			) : null}
			{view === 'List' ? (
				<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<TaskList
						tasks={tasks}
						board={board}
						openTaskDetail={openTaskDetail}
					/>
				</div>
			) : null}
			{selectedTask && (
				<TaskDetailModal
					task={selectedTask}
					onClose={closeTaskDetail}
					columns={board}
				/>
			)}
			<Drawer open={mobileMenu} onOpenChange={setMobileMenu}>
				<DrawerTrigger className='absolute bottom-4 right-4 rounded-full lg:hidden flex w-16 h-16 bg-background border items-center justify-center'>
					<ChevronUp className='h-8 w-8' />
				</DrawerTrigger>
				<DrawerContent className='h-[80%] px-6'>
					<VisuallyHidden>
						<DrawerHeader>
							<DrawerTitle>Context Menu</DrawerTitle>
							<DrawerDescription>
								User context menu
							</DrawerDescription>
						</DrawerHeader>
					</VisuallyHidden>
					<div className='flex items-center justify-between mt-6'>
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
										setMobileMenu(false);
										setIsNewDialogOpen(true);
									}}
									className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
									<ClipboardList className='h-4 w-4' />
									<span>Task</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setMobileMenu(false);
										setIsColumnDialogOpen(true);
									}}
									className='flex items-center gap-2 rounded-lg px-2 py-1.5'>
									<Columns3 className='h-4 w-4' />
									<span>Column</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Separator className='my-6 opacity-50' />

					<div className='space-y-4'>
						<ToggleGroup
							type='single'
							value={view}
							className='grid w-full grid-cols-2 gap-2'>
							<ToggleGroupItem
								onClick={async (event) => {
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

					<div className='mt-auto space-y-3 mb-6'>
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
											{
												auth?.user?.user_metadata[
													'name'
												][0]
											}
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
									onClick={async () => {
										setMobileMenu(false);
										await signOut();
									}}
									className='rounded-lg px-2 py-1.5 text-red-500 dark:text-red-400'>
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</DrawerContent>
			</Drawer>
		</section>
	);
}

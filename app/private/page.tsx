'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from '@/components/auth-provider';
import Loading from '@/components/Loading';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClipboardList, Table, ChevronDown } from 'lucide-react';
import { NewTaskDialog } from '@/components/NewTaskDialog';
import { NewColumnDialog } from '@/components/NewColumnDialog';
import { subscribeBoard, subscribeTasks } from './actions';
import { TaskList } from '@/components/List';

export interface Column {
	id: string;
	title: string;
	user_id: string;
	position: number;
}

export default function PrivatePage() {
	const router = useRouter();
	const auth = useAuth();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [board, setBoard] = useState<Column[]>([]);
	const [loading, setLoading] = useState(true);
	const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
	const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
	const [view, setView] = useState<'Board' | 'List'>('Board');

	const fetchTasks = useCallback(async () => {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', auth.user?.id);
		if (error) {
			console.error(error);
		} else {
			setTasks(data as Task[]);
		}
	}, [auth.user?.id, setTasks]);

	const fetchBoard = useCallback(async () => {
		const { data, error } = await supabase
			.from('kanban_columns')
			.select('*')
			.eq('user_id', auth.user?.id)
			.order('position');
		if (error) {
			console.error(error);
			return;
		}
		setBoard(data as Column[]);
	}, [auth.user?.id, setBoard]);

	useEffect(() => {
		const fetchData = async () => {
			await fetchTasks();
			await fetchBoard();
			setLoading(false);
		};
		fetchData();
	}, [fetchTasks, fetchBoard]);

	useEffect(() => {
		const tasksChannel = subscribeTasks(setTasks, auth?.user?.id);
		const columnsChannel = subscribeBoard(setBoard, auth?.user?.id);

		return () => {
			supabase.removeChannel(tasksChannel);
			supabase.removeChannel(columnsChannel);
		};
	}, [auth.user?.id]);

	if (!auth?.user) {
		router.push('/login');
		return;
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<section className='px-6 py-3 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden pb-4'>
			<div className='flex justify-between max-h-full items-center'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<h3 className='flex items-center scroll-m-20 text-sm font-semibold tracking-tight p-2 rounded-md border-2'>
							{view}
							<ChevronDown className='ml-2' size={16} />
						</h3>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='start' className='w-fit'>
						<DropdownMenuLabel>Select view</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => setView('Board')}>
								Board
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setView('List')}>
								List
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>+ New</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-fit-content'>
						<DropdownMenuItem
							onClick={() => setIsNewDialogOpen(true)}>
							<ClipboardList className='mr-2 h-4 w-4' />
							Task
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setIsColumnDialogOpen(true)}>
							<Table className='mr-2 h-4 w-4' />
							Column
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<NewTaskDialog
				open={isNewDialogOpen}
				setOpen={setIsNewDialogOpen}
				userId={auth.user.id}
				board={board}
			/>
			<NewColumnDialog
				open={isColumnDialogOpen}
				setOpen={setIsColumnDialogOpen}
				userId={auth.user.id}
				board={board}
			/>
			{view === 'Board' ? (
				<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<KanbanBoard tasks={tasks} columns={board} />
				</div>
			) : null}
			{view === 'List' ? (
				<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<TaskList tasks={tasks} board={board} />
				</div>
			) : null}
		</section>
	);
}

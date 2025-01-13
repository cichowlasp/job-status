'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';
import { use, useCallback, useEffect, useState } from 'react';
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
import { subscribeBoard, subscribeTasks, subscribeView } from './actions';
import { TaskList } from '@/components/List';
import { TaskDetailModal } from '@/components/TaskDetailsModal';
import { set } from 'zod';

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
	const [tasks, setTasks] = useState<Task[]>([]);
	const [board, setBoard] = useState<Column[]>([]);
	const [loading, setLoading] = useState(true);
	const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
	const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
	const [view, setView] = useState<'Board' | 'List'>('Board');
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
							<DropdownMenuItem
								onClick={async () =>
									await supabase
										.from('view')
										.update({
											view: 'Board',
										})
										.eq('user_id', auth?.user?.id)
								}>
								Board
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={async () =>
									await supabase
										.from('view')
										.update({
											view: 'List',
										})
										.eq('user_id', auth?.user?.id)
								}>
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
			) : null}

			{view === 'Board' ? (
				<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
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
		</section>
	);
}

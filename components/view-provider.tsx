'use client';

import React, {
	useContext,
	createContext,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from './auth-provider';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Task } from './task-card';
import { Column } from '@/app/private/layout';
import { subscribeBoard, subscribeTasks, subscribeView } from '@/utils/actions';

interface ViewProviderProps {
	children: React.ReactNode;
}

const ViewContext = createContext<ViewContextType>({
	view: 'Board',
	setView: () => {},
	setIsNewDialogOpen: () => {},
	isNewDialogOpen: false,
	isColumnDialogOpen: false,
	setIsColumnDialogOpen: () => {},
	board: [],
	setBoard: () => {},
	tasks: [],
	setTasks: () => {},
	loading: true,
	setLoading: () => {},
	mobileMenu: false,
	setMobileMenu: () => {},
	selectedTask: null,
	setSelectedTask: () => {},
	openTaskDetail: () => {},
	closeTaskDetail: () => {},
});

type ViewContextType = {
	view: 'Board' | 'List';
	setView: React.Dispatch<React.SetStateAction<'Board' | 'List'>>;
	setIsNewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isNewDialogOpen: boolean;
	isColumnDialogOpen: boolean;
	setIsColumnDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	board: Column[];
	setBoard: React.Dispatch<React.SetStateAction<Column[]>>;
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	mobileMenu: boolean;
	setMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTask: Task | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
	openTaskDetail: (task: Task) => void;
	closeTaskDetail: () => void;
};

export function ViewProvider(props: ViewProviderProps) {
	const auth = useAuth();
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();
	const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
	const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
	const [view, setView] = useState<'Board' | 'List'>('Board');
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [mobileMenu, setMobileMenu] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [board, setBoard] = useState<Column[]>([]);
	const [loading, setLoading] = useState(true);

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
		console.log(path);
		router.push(`${path}/?taskId=${task.id}`);
	};

	const closeTaskDetail = () => {
		setSelectedTask(null);
		router.push(`${path}/`);
	};

	const value = {
		view,
		setView,
		setIsNewDialogOpen,
		isNewDialogOpen,
		isColumnDialogOpen,
		setIsColumnDialogOpen,
		board,
		setBoard,
		tasks,
		setTasks,
		loading,
		setLoading,
		mobileMenu,
		setMobileMenu,
		selectedTask,
		setSelectedTask,
		openTaskDetail,
		closeTaskDetail,
	};

	return (
		<ViewContext.Provider value={value}>
			{props.children}
		</ViewContext.Provider>
	);
}

export const useView = () => {
	return useContext(ViewContext);
};

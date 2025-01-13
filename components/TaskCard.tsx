'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { Link as Linkicon, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/utils/supabase/useSupabase';
import { useState } from 'react';
import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';

export interface Task {
	id: UniqueIdentifier;
	columnId: string;
	link?: string;
	content?: string;
	jobTitle: string;
	user_id: string;
	active: boolean;
}

interface TaskCardProps {
	task: Task;
	isOverlay?: boolean;
	openTaskDetail: (task: Task) => void;
}

export type TaskType = 'Task';

export interface TaskDragData {
	type: TaskType;
	task: Task;
}

interface TaskData {
	jobTitle: string;
	link?: string;
	content?: string;
	columnId: string;
}

export function TaskCard({ task, isOverlay, openTaskDetail }: TaskCardProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		} satisfies TaskDragData,
		attributes: {
			roleDescription: 'Task',
		},
	});

	const auth = useAuth();
	const router = useRouter();
	const [taskData, setTaskData] = useState<TaskData>({
		jobTitle: task.jobTitle,
		link: task.link,
		content: task.content,
		columnId: task.columnId,
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	};

	const variants = cva('', {
		variants: {
			dragging: {
				over: 'ring-2 opacity-30',
				overlay: 'ring-2 ring-primary',
			},
		},
	});

	const deleteTask = async (id: UniqueIdentifier) => {
		const response = await supabase.from('tasks').delete().eq('id', id);
		console.log(response);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setTaskData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log('Submitted task data:', taskData);
		const { error } = await supabase
			.from('tasks')
			.update({ ...taskData, user_id: auth?.user?.id })
			.eq('id', task.id);
		if (error) {
			console.error(error);
		}
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={`${variants({
				dragging: isOverlay
					? 'overlay'
					: isDragging
					? 'over'
					: undefined,
			})} relative`}>
			<CardHeader
				{...attributes}
				{...listeners}
				className='px-3 py-3 space-between hover:cursor-grab flex flex-row border-b-2 border-secondary relative'>
				<span className='mr-auto my-auto'> {task.jobTitle}</span>
			</CardHeader>
			<DropdownMenu>
				<DropdownMenuTrigger className='absolute right-4 top-2'>
					···
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() =>
							router.push(`private/?taskId=${task.id}`, undefined)
						}>
						<Pencil className='mr-2 h-4 w-4' />
						Edit task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={async () => await deleteTask(task.id)}>
						<Trash className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CardContent
				onClick={() => openTaskDetail(task)}
				className='px-3 pt-3 pb-6 text-left whitespace-pre-wrap hover:cursor-pointer'>
				{task.content && <p>{task.content}</p>}
				{task.link && (
					<Button variant='link' asChild>
						<div>
							<Linkicon className='h-[1rem] w-[1rem]' />
							<Link
								className='pl-2'
								target='_blank'
								href={task.link}>
								Link
							</Link>
						</div>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

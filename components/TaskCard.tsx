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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/utils/supabase/useSupabase';
import { use, useState } from 'react';
import { useAuth } from './auth-provider';

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
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
				className='px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative'>
				<span className='mr-auto my-auto'> {task.jobTitle}</span>
			</CardHeader>
			<DropdownMenu>
				<DropdownMenuTrigger className='absolute right-4 top-2'>
					···
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={async () => await deleteTask(task.id)}>
						<Trash className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
						<Pencil className='mr-2 h-4 w-4' />
						Edit task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Edit task</DialogTitle>
						<DialogDescription>
							Fill in the details to change task informations.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='jobTitle'>Task name</Label>
							<Input
								id='jobTitle'
								name='jobTitle'
								value={taskData.jobTitle}
								onChange={handleInputChange}
								placeholder='Enter job title'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='link'>Link</Label>
							<Input
								id='link'
								name='link'
								value={taskData.link}
								onChange={handleInputChange}
								placeholder='Enter link (optional)'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='content'>Content</Label>
							<Textarea
								id='content'
								name='content'
								value={taskData.content}
								onChange={handleInputChange}
								placeholder='Enter task content (optional)'
								rows={4}
							/>
						</div>
						<DialogFooter>
							<DialogClose className='w-full' asChild>
								<Button className='w-full' type='submit'>
									Save changes
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<CardContent
				onClick={() => openTaskDetail(task)}
				className='px-3 pt-3 pb-6 text-left whitespace-pre-wrap'>
				{task.content && <p>{task.content}</p>}
				{task.link && (
					<Button variant='link' className='px-0'>
						<Linkicon className='h-[1rem] w-[1rem]' />
						<Link className='pl-2' target='_blank' href={task.link}>
							Link
						</Link>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

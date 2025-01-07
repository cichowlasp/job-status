import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { Link as Linkicon } from 'lucide-react';
import { ColumnId } from './KanbanBoard';
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/utils/supabase/useSupabase';

export interface Task {
	id: UniqueIdentifier;
	columnId: ColumnId;
	link?: string;
	content?: string;
	jobTitle: string;
}

interface TaskCardProps {
	task: Task;
	isOverlay?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
	type: TaskType;
	task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
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
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CardContent className='px-3 pt-3 pb-6 text-left whitespace-pre-wrap'>
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

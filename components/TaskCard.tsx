import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { Link as Linkicon } from 'lucide-react';
import { Badge } from './ui/badge';
import { ColumnId } from './KanbanBoard';
import Link from 'next/link';

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

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={variants({
				dragging: isOverlay
					? 'overlay'
					: isDragging
					? 'over'
					: undefined,
			})}>
			<CardHeader
				{...attributes}
				{...listeners}
				className='px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative'>
				<span className='mr-auto my-auto'> {task.jobTitle}</span>
				<Badge variant={'outline'} className='ml-auto font-semibold'>
					Task
				</Badge>
			</CardHeader>
			<CardContent className='px-3 pt-3 pb-6 text-left whitespace-pre-wrap'>
				{task.content && <p>{task.content}</p>}
				{task.link && (
					<Button variant='link' className='px-0'>
						<Linkicon className='h-[1rem] w-[1rem]' />
						<Link className='pl-2' href={task.link}>
							Link
						</Link>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

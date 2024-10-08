import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { Task, TaskCard } from './TaskCard';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export interface Column {
	id: UniqueIdentifier;
	title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
	type: ColumnType;
	column: Column;
}

interface BoardColumnProps {
	column: Column;
	tasks: Task[];
	isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
	const tasksIds = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		} satisfies ColumnDragData,
		attributes: {
			roleDescription: `Column: ${column.title}`,
		},
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	};

	const variants = cva(
		'h-[70vh] max-h-[70vh] w-[270px] sm:w-[350px] lg:w-[450px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
		{
			variants: {
				dragging: {
					default: 'border-2 border-transparent',
					over: 'ring-2 opacity-30',
					overlay: 'ring-2 ring-primary',
				},
			},
		}
	);

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
				className='px-4 py-2 font-semibold border-b-2 text-left flex flex-row space-between items-center'>
				<span className='mr-auto my-auto'> {column.title}</span>
			</CardHeader>
			<ScrollArea>
				<CardContent className='flex flex-grow flex-col gap-2 p-2'>
					<SortableContext items={tasksIds}>
						{tasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
					</SortableContext>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
	const dndContext = useDndContext();

	const variations = cva('flex pb-4 h-full', {
		variants: {
			dragging: {
				default: 'snap-x snap-mandatory',
				active: 'snap-none',
			},
		},
	});

	return (
		<ScrollArea
			className={variations({
				dragging: dndContext.active ? 'active' : 'default',
			})}>
			<div className='min-h-[70vh] flex gap-4 h-full w-full items-center sm:justify-center flex-row'>
				{children}
			</div>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	);
}

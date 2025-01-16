import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { Task, TaskCard } from './TaskCard';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import type { Column } from '@/app/private/layout';
import { Button } from './ui/button';
import { Pencil, Check, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { supabase } from '@/utils/supabase/useSupabase';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { promise } from 'zod';

export type ColumnType = 'Column';

export interface ColumnDragData {
	type: ColumnType;
	column: Column;
}

interface BoardColumnProps {
	column: Column;
	tasks: Task[];
	isOverlay?: boolean;
	columns: Column[];
	openTaskDetail: (task: Task) => void;
}

export function BoardColumn({
	column,
	tasks,
	isOverlay,
	columns,
	openTaskDetail,
}: BoardColumnProps) {
	const [edit, setEdit] = useState(false);
	const [columnName, setColumnName] = useState(column.title);
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
		'h-[70vh] max-h-[70vh] w-[270px] sm:w-[350px] lg:w-[375px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await supabase
			.from('kanban_columns')
			.update({ title: columnName })
			.eq('id', column.id);
		setEdit(false);
	};

	const deleteColumn = async () => {
		const leftColumns = columns.filter((el) => el.id !== column.id);
		let itemsProcessed = 0;
		tasks.forEach(async (task) => {
			await supabase
				.from('tasks')
				.update({
					columnId: leftColumns[0].id,
				})
				.eq('id', task.id);
			itemsProcessed++;
			if (itemsProcessed === tasks.length) {
				const { error } = await supabase
					.from('kanban_columns')
					.delete()
					.eq('id', column.id);
				if (error) {
					console.error(error);
				}
			}
		});
	};

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
			<CardHeader className='px-4 py-2 font-semibold border-b-2 text-left flex flex-row space-between items-center'>
				{edit ? (
					<>
						<form onSubmit={handleSubmit} className='flex'>
							<Input
								autoFocus={true}
								className=' my-auto md:w-full w-1/2 h-full'
								value={columnName}
								onChange={(event) =>
									setColumnName(event.target.value)
								}></Input>
							<Button
								type='submit'
								variant='default'
								aria-label='submit'
								className='ml-3 my-auto h-fit w-2 rounded'>
								<Check />
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										aria-label='delete'
										variant='destructive'
										className='ml-2 my-auto h-fit w-2 rounded '>
										<Trash />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure to delete
											<span className='italic'>
												{' '}
												&quot;
												{column.title}&quot;
											</span>{' '}
											column?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will permanently delete this column
											and move all task to the first
											column.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={async () => {
												await deleteColumn();
											}}
											className={buttonVariants({
												variant: 'destructive',
											})}>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</form>
					</>
				) : (
					<span
						{...attributes}
						{...listeners}
						className='mr-auto my-auto w-full'>
						{' '}
						{column.title}
					</span>
				)}
				<Button
					onClick={(e) => {
						setEdit((prev) => !prev);
					}}
					variant='ghost'
					aria-label='edit'
					className='ml-auto my-auto  h-8 w-2'>
					<Pencil />
				</Button>
			</CardHeader>

			<ScrollArea>
				<CardContent className='flex flex-grow flex-col gap-2 p-2'>
					<SortableContext items={tasksIds}>
						{tasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								openTaskDetail={openTaskDetail}
							/>
						))}
					</SortableContext>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
	const dndContext = useDndContext();

	const variations = cva('flex pb-4', {
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

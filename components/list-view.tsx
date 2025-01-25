'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Task as TaskData } from '@/components/task-card';
import type { Column } from '@/app/private/layout';
import type { Task } from '@/components/task-card';
import { CalendarIcon, ExternalLink } from 'lucide-react';
import { Archive, Copy, Pencil, Trash } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/utils/supabase/useSupabase';
import { MoreHorizontal } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { format } from 'date-fns';

interface TaskListProps {
	tasks: TaskData[];
	board: Column[];
	openTaskDetail: (task: Task) => void;
}

export function TaskList({ tasks, board, openTaskDetail }: TaskListProps) {
	const auth = useAuth();
	const router = useRouter();

	const handleArchive = async (task: Task) => {
		const { error } = await supabase
			.from('tasks')
			.update({ active: !task.active })
			.eq('id', task.id);
		if (error) console.error(error);
	};

	const handleDuplicate = async (task: Task) => {
		const { id, ...duplicatedTask } = task;
		const { error } = await supabase
			.from('tasks')
			.insert({ ...duplicatedTask, active: true })
			.eq('user_id', auth.user?.id);
		if (error) {
			console.log(error);
		}
	};

	const handleDelete = async (task: Task) => {
		const { error } = await supabase
			.from('tasks')
			.delete()
			.eq('id', task.id);
		if (error) console.error(error);
	};

	const handleEdit = (task: Task) => {
		router.push(`private/?taskId=${task.id}`, undefined);
	};

	return (
		<ScrollArea className='h-[100%] rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow className='bg-muted/50'>
						<TableHead className='font-semibold w-[60%] sm:w-[30%]'>
							Task
						</TableHead>
						<TableHead className='font-semibold hidden md:table-cell w-[15%]'>
							Link
						</TableHead>
						<TableHead className='font-semibold hidden sm:table-cell w-[25%]'>
							Description
						</TableHead>
						<TableHead className='font-semibold w-[40%] sm:w-[15%]'>
							Status
						</TableHead>
						<TableHead className='font-semibold hidden sm:table-cell w-[15%]'>
							Due Date
						</TableHead>
						<TableHead className='w-[48px] hidden sm:table-cell'>
							<span className='sr-only'>Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow className='group' key={task.id}>
							<TableCell
								className='font-medium p-4'
								onClick={(e) => {
									e.stopPropagation();
									openTaskDetail(task);
								}}>
								<div className='flex flex-col gap-2'>
									<span className='font-medium text-foreground'>
										{task.jobTitle}
									</span>
									<div className='flex flex-col gap-2 sm:hidden'>
										<span className='text-sm text-muted-foreground line-clamp-2'>
											{task.content}
										</span>
										<div className='flex items-center gap-2'>
											<div className='flex-1'>
												{task.dueDate ? (
													<div className='flex items-center gap-2 text-sm text-muted-foreground'>
														<CalendarIcon className='h-4 w-4' />
														{format(
															new Date(
																task.dueDate
															),
															'MMM d, yyyy'
														)}
													</div>
												) : (
													<div className='flex items-center gap-2 text-sm text-muted-foreground'>
														<CalendarIcon className='h-4 w-4' />
														No due date
													</div>
												)}
											</div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														className='h-8 w-8 p-0 sm:hidden ml-auto'>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>
															Open menu
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align='end'
													className='w-[180px]'>
													<DropdownMenuItem
														onClick={() =>
															handleArchive(task)
														}
														className='py-2'>
														<Archive className='mr-2 h-4 w-4' />
														{task.active
															? 'Archive'
															: 'Unarchive'}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleEdit(task)
														}
														className='py-2'>
														<Pencil className='mr-2 h-4 w-4' />
														Edit task
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleDuplicate(
																task
															)
														}
														className='py-2'>
														<Copy className='mr-2 h-4 w-4' />
														Duplicate
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleDelete(task)
														}
														className='text-red-600 dark:text-red-400 py-2'>
														<Trash className='mr-2 h-4 w-4' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell className='hidden md:table-cell align-top'>
								{task.link ? (
									<a
										href={task.link}
										target='_blank'
										onClick={(e) => e.stopPropagation()}
										className='inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors'>
										<ExternalLink className='h-4 w-4' />
										<span className='hidden lg:inline'>
											Visit
										</span>
									</a>
								) : (
									<span className='text-muted-foreground text-sm'>
										—
									</span>
								)}
							</TableCell>
							<TableCell className='hidden sm:table-cell align-top'>
								<p className='line-clamp-2 text-sm text-muted-foreground'>
									{task.content}
								</p>
							</TableCell>
							<TableCell className='align-top min-w-[120px] p-4'>
								<Select
									defaultValue={
										board.find(
											(col) => col.id === task.columnId
										)?.id || ''
									}
									onValueChange={async (value) => {
										const { error } = await supabase
											.from('tasks')
											.update({ columnId: value })
											.eq('id', task.id);
										if (error) console.error(error);
									}}>
									<SelectTrigger
										onClick={(e) => e.stopPropagation()}
										className='w-full h-9'>
										<SelectValue placeholder='Set status' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Status</SelectLabel>
											{board.map((column) => (
												<SelectItem
													key={column.id}
													value={column.id}>
													{column.title}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</TableCell>
							<TableCell className='hidden sm:table-cell align-top'>
								{task.dueDate ? (
									<div className='flex items-center gap-2 text-sm text-muted-foreground'>
										<CalendarIcon className='h-4 w-4' />
										{format(
											new Date(task.dueDate),
											'MMM d, yyyy'
										)}
									</div>
								) : (
									<span className='text-muted-foreground text-sm'>
										—
									</span>
								)}
							</TableCell>
							<TableCell className='p-0 pr-2 hidden sm:table-cell'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='h-8 w-8 p-0 hover:bg-muted'
											onClick={(e) =>
												e.stopPropagation()
											}>
											<MoreHorizontal className='h-4 w-4' />
											<span className='sr-only'>
												Open menu
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align='end'
										className='w-[180px]'>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												handleArchive(task);
											}}
											className='py-2'>
											<Archive className='mr-2 h-4 w-4' />
											{task.active
												? 'Archive'
												: 'Unarchive'}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												handleEdit(task);
											}}
											className='py-2'>
											<Pencil className='mr-2 h-4 w-4' />
											Edit task
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												handleDuplicate(task);
											}}
											className='py-2'>
											<Copy className='mr-2 h-4 w-4' />
											Duplicate
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(task);
											}}
											className='text-red-600 dark:text-red-400 py-2'>
											<Trash className='mr-2 h-4 w-4' />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</ScrollArea>
	);
}

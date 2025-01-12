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
import type { Task as TaskData } from '@/components/TaskCard';
import type { Column } from '@/app/private/page';
import type { Task } from '@/components/TaskCard';
import { Link } from 'lucide-react';

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

interface TaskListProps {
	tasks: TaskData[];
	board: Column[];
	openTaskDetail: (task: Task) => void;
}

export function TaskList({ tasks, board, openTaskDetail }: TaskListProps) {
	return (
		<ScrollArea className='h-[100%] rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Task Title</TableHead>
						<TableHead className='sm:table-cell hidden'>
							Link
						</TableHead>
						<TableHead>Content</TableHead>
						<TableHead>Column</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow
							className='cursor-pointer '
							onClick={() => openTaskDetail(task)}
							key={task.id}>
							<TableCell>{task.jobTitle}</TableCell>
							<TableCell className='sm:table-cell hidden'>
								<a
									href={task.link}
									target='_blank'
									className='font-medium hover:underline'>
									<Link />
								</a>
							</TableCell>
							<TableCell className='sm:max-w-[300px] max-w-[50px] truncate'>
								{task.content}
							</TableCell>
							<TableCell className='sm:min-w-[100px] truncate'>
								<Select
									defaultValue={
										board.find(
											(col) => col.id === task.columnId
										)?.id || ''
									}
									onValueChange={async (value) => {
										const { error } = await supabase
											.from('tasks')
											.update({
												columnId: value,
											})
											.eq('id', task.id);
										if (error) {
											console.error(error);
										}
									}}>
									<SelectTrigger className='md:w-[150px]  w-[100px] truncate'>
										<SelectValue placeholder='Select column' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Column</SelectLabel>
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
						</TableRow>
					))}
				</TableBody>
			</Table>
		</ScrollArea>
	);
}

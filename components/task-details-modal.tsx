'use client';

import type { Task } from './task-card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Column } from '@/app/private/layout';
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
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
// Add these imports at the top
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Label } from './ui/label';

interface TaskDetailModalProps {
	task: Task;
	onClose: () => void;
	columns: Column[];
}

export function TaskDetailModal({
	task,
	onClose,
	columns,
}: TaskDetailModalProps) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className='md:w-[50%] w-[90%]'>
				<DialogHeader className='space-y-4'>
					<div>
						<DialogDescription className='text-sm font-medium text-muted-foreground'>
							Task Details
						</DialogDescription>
						<DialogTitle className='text-xl mt-1'>
							<Input
								className='font-semibold transition-colors px-4 h-auto mt-4'
								onChange={async (event) => {
									const { error } = await supabase
										.from('tasks')
										.update({
											jobTitle: event.target.value,
										})
										.eq('id', task.id);
									if (error) console.error(error);
								}}
								defaultValue={task.jobTitle}
							/>
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className='grid gap-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label className='text-sm font-medium'>
								Due Date
							</Label>
							<Popover
								modal={true}
								open={isCalendarOpen}
								onOpenChange={setIsCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										className='w-full justify-start text-left font-normal'>
										{task.dueDate ? (
											format(
												new Date(task.dueDate),
												'PPP'
											)
										) : (
											<span className='text-muted-foreground'>
												Pick a date
											</span>
										)}
										<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className='w-auto p-0'
									align='start'>
									<Calendar
										mode='single'
										selected={
											task.dueDate
												? new Date(task.dueDate)
												: undefined
										}
										onSelect={async (date) => {
											const { error } = await supabase
												.from('tasks')
												.update({
													dueDate: date
														? new Date(
																date.setHours(
																	12
																)
														  ).toISOString()
														: null,
												})
												.eq('id', task.id);
											if (error) console.error(error);
											setIsCalendarOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className='space-y-2'>
							<Label className='text-sm font-medium'>
								Status
							</Label>
							<Select
								defaultValue={
									columns.find(
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
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select status' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{columns.map((column) => (
											<SelectItem
												key={column.id}
												value={column.id}>
												{column.title}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Link</Label>
						<div className='flex gap-2'>
							<Input
								className='flex-1'
								onChange={async (event) => {
									const { error } = await supabase
										.from('tasks')
										.update({ link: event.target.value })
										.eq('id', task.id);
									if (error) console.error(error);
								}}
								placeholder='https://example.com'
								defaultValue={task.link}
							/>
							<Button variant='secondary' size='icon' asChild>
								<Link
									href={task?.link || '#'}
									target={task?.link ? '_blank' : ''}>
									<LinkIcon className='h-4 w-4' />
								</Link>
							</Button>
						</div>
					</div>

					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Notes</Label>
						<Textarea
							className='min-h-[200px] resize-none'
							onChange={async (event) => {
								const { error } = await supabase
									.from('tasks')
									.update({ content: event.target.value })
									.eq('id', task.id);
								if (error) console.error(error);
							}}
							placeholder='Add your notes here...'
							defaultValue={task.content}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

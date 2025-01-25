import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
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
import type { Task as TaskData } from './task-card';
import { supabase } from '@/utils/supabase/useSupabase';
import type { Column } from '@/app/private/layout';

export const NewTaskDialog = ({
	open,
	setOpen,
	userId,
	board,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	userId: string;
	board: Column[];
}) => {
	const [taskData, setTaskData] = useState<
		TaskData & { dueDate: Date | undefined }
	>({
		id: '',
		user_id: userId,
		jobTitle: '',
		link: '',
		content: '',
		columnId: '',
		active: true,
		dueDate: undefined,
	});
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
		const { id, dueDate, ...dataWithoutId } = taskData;

		const { error } = await supabase.from('tasks').insert({
			...dataWithoutId,
			user_id: userId,
			columnId: board[0].id,
			dueDate: dueDate?.toISOString(),
		});

		console.log({
			...dataWithoutId,
			user_id: userId,
			columnId: board[0].id,
			dueDate: dueDate?.toISOString(),
		});

		if (error) {
			console.error(error);
		}

		setTaskData({
			id: '',
			user_id: userId,
			jobTitle: '',
			link: '',
			content: '',
			columnId: '',
			active: true,
			dueDate: undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-[425px] w-[90%]'>
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new task.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(e);
						setOpen(false);
					}}
					className='space-y-4'>
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
						<Label>Due Date</Label>
						<Popover
							modal={true}
							open={isCalendarOpen}
							onOpenChange={setIsCalendarOpen}>
							<PopoverTrigger asChild>
								<Button
									type='button'
									variant='outline'
									className='w-full justify-start text-left font-normal'>
									{taskData.dueDate ? (
										format(taskData.dueDate, 'PPP')
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
								align='start'
								side='bottom'>
								<Calendar
									mode='single'
									selected={taskData.dueDate}
									onSelect={(date) => {
										setTaskData((prev) => ({
											...prev,
											dueDate: date,
										}));
										setIsCalendarOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
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
						<Button className='w-full' type='submit'>
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

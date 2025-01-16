import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import type { Task as TaskData } from './TaskCard';
import { supabase } from '@/utils/supabase/useSupabase';
import type { Column } from '@/app/private/page';

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
	const [taskData, setTaskData] = useState<TaskData>({
		id: '',
		user_id: userId,
		jobTitle: '',
		link: '',
		content: '',
		columnId: '',
		active: true,
	});

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

		const { id, ...dataWithoutId } = taskData;
		console.log('Submitted task data:', dataWithoutId);

		const { error } = await supabase.from('tasks').insert({
			...dataWithoutId,
			user_id: userId,
			columnId: board[0].id,
		});
		if (error) {
			console.error(error);
		}

		// Reset form after submission
		setTaskData({
			id: '',
			user_id: userId,
			jobTitle: '',
			link: '',
			content: '',
			columnId: '',
			active: true,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className='sm:max-w-[425px] w-[90%]'>
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new task.
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
	);
};

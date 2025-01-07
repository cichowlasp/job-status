'use client';
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { defaultCols, KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from '@/components/auth-provider';
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

export default function PrivatePage() {
	const router = useRouter();
	const auth = useAuth();
	const [tasks, setTasks] = useState<Task[]>([]);

	interface TaskData {
		jobTitle: string;
		link: string;
		content: string;
		columnId: string;
	}

	const [taskData, setTaskData] = useState<TaskData>({
		jobTitle: '',
		link: '',
		content: '',
		columnId: defaultCols[0].id,
	});

	const fetchTasks = useCallback(async () => {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', auth.user?.id);
		if (error) {
			console.error(error);
		} else {
			setTasks(data as Task[]);
		}
	}, [auth.user?.id, setTasks]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	useEffect(() => {
		const channel = supabase
			.channel('tasks')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tasks',
					filter: `user_id=eq.${auth.user?.id}`,
				},
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							console.log('INSERTED', payload);
							setTasks((pre) => {
								return [...pre, payload.new as Task];
							});
							return;
						case 'UPDATE':
							console.log('UPDATE', payload);
							setTasks((pre) => {
								return pre.map((el) => {
									if (el.id === payload.new.id)
										return payload.new as Task;
									return el;
								});
							});
							return;
						case 'DELETE':
							console.log('DELETE', payload);
							setTasks((pre) => {
								return pre.filter(
									(el) => el.id !== payload.old.id
								);
							});
							return;
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [auth.user?.id]);

	if (!auth?.user) {
		return router.push('/login');
	}

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
			.insert({ ...taskData, user_id: auth?.user?.id });
		await fetchTasks();
		console.error(error);
		// Reset form after submission
		setTaskData({
			jobTitle: '',
			link: '',
			content: '',
			columnId: defaultCols[0].id,
		});
	};

	return (
		<section className='px-6 py-3 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden pb-4'>
			<div className='flex justify-between max-h-full items-center'>
				<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
					Tasks
				</h3>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline'>+ New Task</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Create New Task</DialogTitle>
							<DialogDescription>
								Fill in the details to create a new task.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='jobTitle'>Job Title</Label>
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
			</div>
			<div className='w-full py-3 h-[calc(100%-2rem)]'>
				{tasks ? (
					<KanbanBoard tasks={tasks} setTasks={setTasks} />
				) : null}
			</div>
		</section>
	);
}

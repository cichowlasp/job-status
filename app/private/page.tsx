'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/useSupabase';
import { useAuth } from '@/components/auth-provider';

export default function PrivatePage() {
	const router = useRouter();
	const auth = useAuth();
	const [tasks, setTasks] = useState<Task[]>();

	useEffect(() => {
		const fetchTasks = async () => {
			const { data, error } = await supabase
				.from('tasks')
				.select('*')
				.eq('user_id', auth.user?.id);
			if (error) {
				console.error(error);
			} else {
				console.log(data);
				setTasks(data as Task[]);
			}
		};
		fetchTasks();
	}, [auth.user?.id]);

	if (!auth?.user) {
		return router.push('/login');
	}

	return (
		<section className='px-6 py-3 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden pb-4'>
			<div className='flex justify-between max-h-full items-center'>
				<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
					All jobs
				</h3>
				<Button>+ New Task</Button>
			</div>
			<div className='w-full py-3 h-[calc(100%-2rem)]'>
				{tasks ? <KanbanBoard tasksList={tasks} /> : null}
			</div>
		</section>
	);
}

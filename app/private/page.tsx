'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { type Task } from '@/components/TaskCard';

export default function PrivatePage() {
	const router = useRouter();
	const data = useAuth();

	const initialTasks: Task[] = [
		{
			id: 'task1',
			columnId: 'applications',
			jobTitle: 'Dolby Labolatory',
			link: 'https://rocketjobs.pl/wroclaw/doswiadczenie_staz-junior?keyword=cyberbezpiecze%C5%84stwo',
			content: 'Project initiation and planning',
		},
	];

	if (!data?.user) {
		return router.push('/login');
	}

	return (
		<section className='px-6 py-3 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden pb-4'>
			<div className='flex justify-between max-h-full items-center'>
				<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
					All jobs
				</h3>
				<Button>+ Add</Button>
			</div>
			<div className='w-full py-3 h-[calc(100%-2rem)]'>
				<KanbanBoard tasksList={initialTasks} />
			</div>
		</section>
	);
}

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';

export default function PrivatePage() {
	const router = useRouter();
	const data = useAuth();

	if (!data?.user) {
		return router.push('/login');
	}

	return (
		<section className='px-6 py-3 max-h-[calc(100%-4rem)] overflow-hidden pb-4'>
			<div className='flex justify-between max-h-full items-center'>
				<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
					All jobs
				</h3>
				<Button>+ Add</Button>
			</div>
			<div className='w-full py-3'>
				<KanbanBoard />
			</div>
		</section>
	);
}

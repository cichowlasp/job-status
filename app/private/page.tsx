'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

export default function PrivatePage() {
	const router = useRouter();
	const data = useAuth();

	if (!data?.user) {
		return router.push('/login');
	}

	return (
		<section className='px-6 py-4'>
			<div className='flex justify-between items-center'>
				<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
					Dashboard
				</h3>
				<Button>+ Add</Button>
			</div>
		</section>
	);
}

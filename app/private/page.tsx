'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export default function PrivatePage() {
	const router = useRouter();
	const data = useAuth();

	if (!data?.user) {
		return router.push('/login');
	}

	return (
		<section className='p-6'>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
				Hello {`${data.user.user_metadata['name']}`}
			</h1>
		</section>
	);
}

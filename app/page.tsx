'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

export default function Home() {
	const auth = useAuth();

	if (auth?.user?.id) {
		redirect('/private');
	}

	return (
		<main className='bg-background'>
			<div className='p-4'>
				<Link href='/' className='text-2xl font-bold mt-4'>
					Task list
				</Link>
			</div>

			<div className='min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden'>
				<div className='z-10 text-center'>
					<h2 className='text-4xl font-bold text-foreground mb-2 animate-fade-in-down'>
						Coming Soon!
					</h2>
					<p className='text-xl text-muted-foreground mb-8 animate-fade-in-up'>
						Task List landing page is under construction.
					</p>
					<div className='flex justify-center mb-6'>
						<Loader2 className='w-12 h-12 text-primary animate-spin' />
					</div>
					<p className='text-muted-foreground mb-8 animate-pulse'>
						We&apos;re working hard to bring you something amazing!
					</p>
					<div className='flex justify-center space-x-4 mb-12'>
						<Button asChild variant='outline'>
							<Link href='/login'>Login</Link>
						</Button>
						<Button asChild>
							<Link href='/register'>Register</Link>
						</Button>
					</div>
				</div>
				<div className='absolute bottom-0 left-0 right-0 flex justify-between p-4 z-10'></div>
			</div>
		</main>
	);
}

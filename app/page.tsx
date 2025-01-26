'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Layout, ListTodo, Smartphone } from 'lucide-react';

export default function Home() {
	const auth = useAuth();

	if (auth?.user?.id) {
		redirect('/private');
	}

	return (
		<main className='min-h-[100dvh] bg-background flex flex-col'>
			<nav className='sticky top-0 z-50 p-6 border-b flex justify-between items-center bg-background/80 backdrop-blur-sm'>
				<Link
					href='/'
					className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text'>
					Task list
				</Link>
				<div className='flex gap-4'>
					<Button asChild variant='ghost'>
						<Link href='/login'>Sign in</Link>
					</Button>
					<Button
						asChild
						className='bg-gradient-to-r from-primary to-primary/80'>
						<Link href='/register'>Get Started</Link>
					</Button>
				</div>
			</nav>

			<section className='flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center'>
				<h1 className='pb-2 text-4xl md:text-5xl font-bold max-w-3xl bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text mb-6'>
					Organize Your Tasks with Simplicity and Efficiency
				</h1>
				<p className='text-lg md:text-xl text-muted-foreground max-w-2xl mb-12'>
					A modern task management solution that helps you stay
					organized and focused on what matters most.
				</p>
				<Button
					asChild
					size='lg'
					className='bg-gradient-to-r from-primary to-primary/80'>
					<Link href='/register'>Start for free</Link>
				</Button>
			</section>

			<section className='grid md:grid-cols-3 gap-8 p-6 md:p-12 bg-muted/50'>
				<div className='space-y-4 text-center p-6'>
					<Layout className='h-8 w-8 mx-auto text-primary' />
					<h3 className='text-xl font-semibold'>
						Intuitive Board View
					</h3>
					<p className='text-muted-foreground'>
						Organize tasks with a visual board that makes task
						management feel natural and effortless.
					</p>
				</div>
				<div className='space-y-4 text-center p-6'>
					<ListTodo className='h-8 w-8 mx-auto text-primary' />
					<h3 className='text-xl font-semibold'>List View Option</h3>
					<p className='text-muted-foreground'>
						Switch to list view for a more detailed and structured
						overview of your tasks.
					</p>
				</div>
				<div className='space-y-4 text-center p-6'>
					<Smartphone className='h-8 w-8 mx-auto text-primary' />
					<h3 className='text-xl font-semibold'>Mobile Friendly</h3>
					<p className='text-muted-foreground'>
						Access and manage your tasks from any device with our
						responsive design.
					</p>
				</div>
			</section>

			<footer className='border-t p-6 text-center text-sm text-muted-foreground'>
				<p>
					© {new Date().getFullYear()} Task List. All rights reserved.
				</p>
			</footer>
		</main>
	);
}

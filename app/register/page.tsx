'use client';

import { useRouter } from 'next/navigation';
import { register } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { registerSchema } from './schema';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import Loading from '@/components/loading-animation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const router = useRouter();

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		setLoading(true);
		const error = await register(values);
		if (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	return (
		<main className='min-h-[100dvh] bg-background flex flex-col'>
			<nav className='p-6 border-b'>
				<a
					href='/'
					className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text'>
					Task list
				</a>
			</nav>

			<div className='flex-1 flex items-center justify-center p-6'>
				<Card className='w-[90%] md:w-[400px] shadow-lg'>
					<CardHeader className='space-y-3 text-center'>
						<CardTitle className='text-2xl font-bold'>
							Create an account
						</CardTitle>
						<CardDescription>
							Enter your details to get started
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<Alert
								variant='destructive'
								className={`${
									error
										? 'opacity-100 h-fit mb-4'
										: 'opacity-0 h-0 overflow-hidden'
								} transition-all duration-200`}>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>{error}</AlertTitle>
							</Alert>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-6'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem className='space-y-1.5'>
											<FormLabel>Full name</FormLabel>
											<FormControl>
												<Input
													placeholder='John Doe'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='space-y-1.5'>
											<FormLabel>Email address</FormLabel>
											<FormControl>
												<Input
													autoComplete='email'
													placeholder='name@example.com'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem className='space-y-1.5'>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													autoComplete='new-password'
													type='password'
													placeholder='••••••••'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									className='w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
									type='submit'>
									{loading ? <Loading /> : 'Create account'}
								</Button>
							</form>
						</Form>
						<div className='mt-6 text-center'>
							<p className='text-sm text-muted-foreground'>
								Already have an account?{' '}
								<a
									href='/login'
									className='text-primary hover:text-primary/90 font-medium'>
									Sign in
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { login } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { loginSchema } from './schema';
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
import { useState, useEffect } from 'react';
import Loading from '@/components/loading-animation';
import { EmailConfirmationModal } from '@/components/email-confirmation-modal';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
	const [loading, setLading] = useState(false);
	const [email, setEmail] = useState<string | null>(null);
	const [error, setError] = useState<string>();
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const param = searchParams.get('email');
		if (param) {
			setEmail(param);
		}
	}, [searchParams, setEmail]);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		setLading(true);
		const error = await login(values);
		if (error) {
			console.log(error);
			setError(error.message);
		}
		setLading(false);
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
							Welcome back
						</CardTitle>
						<CardDescription>
							Enter your credentials to continue
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
													autoComplete='current-password'
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
									{loading ? <Loading /> : 'Sign in'}
								</Button>
							</form>
						</Form>
						<div className='mt-6 text-center'>
							<p className='text-sm text-muted-foreground'>
								Don&apos;t have an account?{' '}
								<a
									href='/register'
									className='text-primary hover:text-primary/90 font-medium'>
									Create account
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
			{email && (
				<EmailConfirmationModal
					mail={email}
					isOpen={!!email}
					onClose={() => {
						router.push('/login');
						setEmail(null);
					}}
				/>
			)}
		</main>
	);
}

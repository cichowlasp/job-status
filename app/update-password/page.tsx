'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import Loading from '@/components/loading-animation';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase/useSupabase';
import { useRouter } from 'next/navigation';

const updatePasswordSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export default function UpdatePasswordPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const router = useRouter();

	const form = useForm<z.infer<typeof updatePasswordSchema>>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
		setLoading(true);
		setError(undefined);
		try {
			const { error } = await supabase.auth.updateUser({
				password: values.password,
			});

			if (error) throw error;
			router.push('/login');
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
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
							Update password
						</CardTitle>
						<CardDescription>
							Enter your new password below
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
									name='password'
									render={({ field }) => (
										<FormItem className='space-y-1.5'>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='••••••••'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem className='space-y-1.5'>
											<FormLabel>
												Confirm Password
											</FormLabel>
											<FormControl>
												<Input
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
									{loading ? <Loading /> : 'Update password'}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

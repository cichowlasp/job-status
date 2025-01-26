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
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/utils/supabase/useSupabase';
import Link from 'next/link';

const resetSchema = z.object({
	email: z.string().email('Invalid email address'),
});

export default function ResetPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState(false);

	const form = useForm<z.infer<typeof resetSchema>>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof resetSchema>) => {
		setLoading(true);
		setError(undefined);
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(
				values.email,
				{
					redirectTo: `${window.location.origin}/update-password`,
				}
			);
			if (error) throw error;
			setSuccess(true);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className='min-h-[100dvh] bg-background flex flex-col'>
			<nav className='p-6 border-b flex items-center gap-4'>
				<Link
					href='/login'
					className='text-muted-foreground hover:text-foreground'>
					<ArrowLeft className='h-5 w-5' />
				</Link>
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
							Reset password
						</CardTitle>
						<CardDescription>
							Enter your email address and we'll send you a link
							to reset your password
						</CardDescription>
					</CardHeader>
					<CardContent>
						{success ? (
							<Alert className='bg-primary/10 text-primary border-primary/20'>
								<AlertTitle>Check your email</AlertTitle>
								We've sent you a password reset link. Please
								check your inbox.
							</Alert>
						) : (
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
												<FormLabel>
													Email address
												</FormLabel>
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
									<Button
										className='w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
										type='submit'>
										{loading ? (
											<Loading />
										) : (
											'Send reset link'
										)}
									</Button>
								</form>
							</Form>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

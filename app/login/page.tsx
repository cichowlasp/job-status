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
		<div className='w-full h-[100dvh] max-w-full flex justify-center items-center'>
			<Card className='w-[90%] md:w-[500px] '>
				<CardHeader className='space-y-4'>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Login and start planning your job :{')'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<Alert
							variant='destructive'
							className={`${
								error
									? 'opacity-100 h-fit mb-4'
									: 'opacity-0 max-h-0'
							} transition-all`}>
							<AlertCircle
								className={`${
									error ? 'h-4 w-4' : 'h-0 w-0'
								} transition-all`}
							/>
							<AlertTitle
								className={`${
									error ? 'h-fit mb-0' : 'hidden max-h-0'
								} transition-all`}>
								{error}
							</AlertTitle>
						</Alert>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='capitalize'>
											{field.name}
										</FormLabel>
										<FormControl>
											<Input
												autoComplete='email'
												placeholder={field.name}
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
									<FormItem>
										<FormLabel className='capitalize'>
											{field.name}
										</FormLabel>
										<FormControl>
											<Input
												autoComplete='current-password'
												type='password'
												placeholder={field.name}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex justify-between gap-6'>
								<Button className='w-full' type='submit'>
									{loading ? <Loading /> : 'Login'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
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
		</div>
	);
}

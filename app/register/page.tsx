'use client';

import { useRouter } from 'next/navigation';
import { signup } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { registerSchema } from './schema';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';

export default function RegisterPage() {
	const [error, setError] = useState<string>();
	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (values: z.infer<typeof registerSchema>) => {
		signup(values);
	};

	return (
		<div className='min-h-[100dvh] flex items-center justify-center py-4'>
			<Card className=' w-[90%] md:w-[500px] h-fit mx-auto'>
				<CardHeader className='space-y-4'>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>
						Sign up and start planning your job :{')'}
					</CardDescription>
				</CardHeader>
				<CardContent>
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
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='capitalize'>
											{field.name}
										</FormLabel>
										<FormControl>
											<Input
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
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='capitalize'>
											{field.name}
										</FormLabel>
										<FormControl>
											<Input
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
												type='password'
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
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='capitalize'>
											Confirm password
										</FormLabel>
										<FormControl>
											<Input
												type='password'
												placeholder='confirm password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex justify-between gap-6'>
								<Button type='submit' className='w-full'>
									Create Account
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

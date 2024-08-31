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

export const registerSchema = z
	.object({
		name: z.string().min(4).max(12),
		email: z.string().min(2).max(50),
		password: z.string().min(7).max(50),
		confirmPassword: z.string().min(7).max(50),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword'],
			});
		}
	});

export default function RegisterPage() {
	const router = useRouter();

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

	const onLogin = () => {
		router.push('/login');
	};

	return (
		<div className='w-full h-full flex justify-center items-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>
						Sign up and start managing your jobs status
					</CardDescription>
				</CardHeader>
				<CardContent>
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
								<Button
									type='button'
									className='w-full'
									onClick={onLogin}
									variant='secondary'>
									Login
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

'use client';

import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
	const router = useRouter();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		login(values);
	};

	const onSignUp = () => {
		router.push('/register');
	};

	return (
		<div className='w-full h-full flex justify-center items-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Login and start managing your job status
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
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
							<div className='flex justify-between gap-6'>
								<Button className='w-full' type='submit'>
									Login
								</Button>
								<Button
									onClick={onSignUp}
									className='w-full'
									type='button'
									variant='secondary'>
									Signup
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

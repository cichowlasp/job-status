'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCallback, useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase/useSupabase';

export default function SettingsPage() {
	const auth = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState(
		auth?.user?.user_metadata['name'] || ''
	);
	const [avatarUrl, setAvatarUrl] = useState(
		auth?.user?.user_metadata['avatar_url'] || ''
	);

	const handleUpdateProfile = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({
				data: {
					name: username,
					avatar_url: avatarUrl,
				},
			});

			if (error) throw error;
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAvatarUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setIsLoading(true);
			const fileExt = file.name.split('.').pop();
			const filePath = `${auth?.user?.id}/${auth?.user?.id}.${fileExt}`;

			// Upload new file
			const { error } = await supabase.storage
				.from('avatars')
				.upload(filePath, file, {
					upsert: true, // This will replace if exists
				});

			if (error) {
				console.log(error);
				throw error;
			}

			const { data } = supabase.storage
				.from('avatars')
				.getPublicUrl(filePath);

			console.log(data.publicUrl);

			setAvatarUrl(data.publicUrl);
		} catch (error) {
			console.error('Error uploading avatar:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file && file.type.startsWith('image/')) {
				const event = {
					target: { files: [file] },
				} as unknown as React.ChangeEvent<HTMLInputElement>;
				await handleAvatarUpload(event);
				setIsDialogOpen(false);
			}
		},
		[handleAvatarUpload]
	);

	return (
		<div className='container h-[calc(100%-5rem)] flex flex-col py-10 space-y-8 px-4 md:px-0'>
			<div className='flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-8'>
				<div className='flex flex-col items-center space-y-4'>
					<div
						className='relative group cursor-pointer'
						onClick={() => setIsDialogOpen(true)}>
						<Avatar className='h-32 w-32 border-2 border-primary/20'>
							<AvatarImage src={avatarUrl} />
							<AvatarFallback className='text-lg'>
								{username[0]}
							</AvatarFallback>
						</Avatar>
						<div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
							<PencilIcon className='h-6 w-6 text-white' />
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='username'>Username</Label>
						<Input
							id='username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Enter your username'
						/>
					</div>

					<div className='space-y-2'>
						<Label>Email</Label>
						<Input
							value={auth?.user?.email || ''}
							disabled
							className='bg-muted'
						/>
					</div>
				</div>

				<Button
					onClick={handleUpdateProfile}
					className='w-full'
					disabled={isLoading}>
					{isLoading && (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					)}
					Save Changes
				</Button>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent
						aria-describedby={undefined}
						className='w-[95%]'>
						<DialogHeader>
							<DialogTitle>Update Profile Picture</DialogTitle>
						</DialogHeader>
						<div className='space-y-4 py-4'>
							<div className='flex items-center justify-center'>
								<Label
									htmlFor='avatar-upload'
									className='cursor-pointer relative inline-flex items-center justify-center'
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}>
									<div
										className={`h-96 w-96 rounded-xl border-2 border-dashed transition-colors duration-200 flex flex-col items-center justify-center gap-4 ${
											isDragging
												? 'border-primary bg-primary/5'
												: 'border-primary/50'
										}`}>
										<ImageIcon className='h-8 w-8 text-primary/50' />
										<div className='text-center space-y-2'>
											<p className='text-sm font-medium'>
												Drop your image here or
											</p>
											<p className='text-xs text-muted-foreground'>
												Click to browse
											</p>
										</div>
									</div>
									<Input
										id='avatar-upload'
										type='file'
										accept='image/*'
										className='hidden'
										onChange={(e) => {
											handleAvatarUpload(e);
											setIsDialogOpen(false);
										}}
									/>
								</Label>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

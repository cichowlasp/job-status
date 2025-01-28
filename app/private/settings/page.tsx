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
import { signOut, supabase } from '@/utils/supabase/useSupabase';

// Add this import at the top with other imports
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	// Add router after other state declarations
	const router = useRouter();
	const auth = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState(
		auth?.user?.user_metadata['name'] || ''
	);
	const [avatarUrl, setAvatarUrl] = useState(
		auth?.user?.user_metadata['avatar_url'] || ''
	);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const handleUpdateProfile = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({
				data: {
					name: username,
				},
			});

			if (error) throw error;
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAvatarUpload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			// Reset states
			setUploadError('');
			setUploadProgress(0);

			// Check file size (1MB = 1024 * 1024 bytes)
			if (file.size > 1024 * 1024) {
				setUploadError('File size must be less than 1MB');
				return;
			}

			try {
				setIsLoading(true);
				// Start simulated progress
				const progressInterval = setInterval(() => {
					setUploadProgress((prev) => {
						if (prev >= 90) {
							clearInterval(progressInterval);
							return 90;
						}
						return prev + 10;
					});
				}, 100);

				const fileExt = file.name.split('.').pop();
				const filePath = `${auth?.user?.id}/${auth?.user?.id}.${fileExt}`;

				const { error } = await supabase.storage
					.from('avatars')
					.upload(filePath, file, {
						upsert: true,
					});

				clearInterval(progressInterval);

				if (error) throw error;

				const { data } = supabase.storage
					.from('avatars')
					.getPublicUrl(filePath);

				const newAvatarUrl = data.publicUrl;

				// Update user data with new avatar URL
				const { error: updateError } = await supabase.auth.updateUser({
					data: {
						avatar_url: newAvatarUrl,
					},
				});

				if (updateError) throw updateError;

				setAvatarUrl(newAvatarUrl);
				setUploadProgress(100);

				setTimeout(() => {
					setUploadProgress(0);
					setIsDialogOpen(false);
				}, 500);
			} catch (error) {
				console.error('Error uploading avatar:', error);
				setUploadError('Failed to upload image. Please try again.');
				setUploadProgress(0);
			} finally {
				setIsLoading(false);
			}
		},
		[auth?.user?.id, setIsDialogOpen]
	);

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
				// Only close if there's no error
			}
		},
		[handleAvatarUpload]
	);

	// Add this new handler function
	const handleSignOutAll = async () => {
		setIsLoading(true);
		const error = await signOut();
		if (error) throw error;
		router.push('/auth/signin');
		setIsLoading(false);
	};

	const handlePasswordUpdate = async () => {
		if (newPassword !== confirmPassword) {
			setPasswordError("New passwords don't match");
			return;
		}

		setIsLoading(true);
		try {
			// First verify the current password
			const { error: signInError } =
				await supabase.auth.signInWithPassword({
					email: auth?.user?.email || '',
					password: currentPassword,
				});

			if (signInError) {
				setPasswordError('Current password is incorrect');
				return;
			}

			// If current password is correct, proceed with password update
			const { error: updateError } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (updateError) throw updateError;

			// Clear form after successful update
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
			setPasswordError('');
		} catch (error) {
			console.error('Error updating password:', error);
			setPasswordError('Failed to update password');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='h-full max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-5rem)] overflow-auto flex flex-col py-6 md:py-10 px-4 md:px-6 bg-gradient-to-b from-background to-muted/20'>
			<div className='flex-1 flex flex-col max-w-4xl mx-auto w-full justify-center'>
				{/* Profile Header */}
				<div className='flex flex-col items-center space-y-6 mb-12'>
					<div
						className='relative group cursor-pointer'
						onClick={() => setIsDialogOpen(true)}>
						<Avatar className='h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-xl'>
							<AvatarImage src={avatarUrl} />
							<AvatarFallback className='text-2xl'>
								{username[0]}
							</AvatarFallback>
						</Avatar>
						<div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-sm'>
							<PencilIcon className='h-6 w-6 md:h-8 md:w-8 text-white' />
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className='grid md:grid-cols-2 gap-6'>
					{/* Profile Section */}
					<section className='space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full flex flex-col'>
						<h2 className='text-xl font-semibold'>
							Profile Information
						</h2>
						<div className='space-y-4 flex-1'>
							<div className='space-y-2'>
								<Label htmlFor='username'>Username</Label>
								<Input
									id='username'
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									placeholder='Enter your username'
									className='transition-colors'
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
							className='w-full mt-auto'
							disabled={isLoading}>
							{isLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Save Changes
						</Button>
					</section>

					{/* Password Section */}
					<section className='space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full flex flex-col'>
						<h2 className='text-xl font-semibold'>Security</h2>
						<div className='space-y-4 flex-1'>
							<div className='space-y-2'>
								<Label htmlFor='current-password'>
									Current Password
								</Label>
								<Input
									id='current-password'
									type='password'
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									placeholder='Enter current password'
									className='transition-colors'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='new-password'>
									New Password
								</Label>
								<Input
									id='new-password'
									type='password'
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									placeholder='Enter new password'
									className='transition-colors'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='confirm-password'>
									Confirm New Password
								</Label>
								<Input
									id='confirm-password'
									type='password'
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									placeholder='Confirm new password'
									className='transition-colors'
								/>
							</div>
							{passwordError && (
								<p className='text-sm text-destructive'>
									{passwordError}
								</p>
							)}
							<Button
								onClick={handlePasswordUpdate}
								className='w-full mt-auto'
								disabled={
									isLoading ||
									!currentPassword ||
									!newPassword ||
									!confirmPassword
								}>
								{isLoading && (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								)}
								Update Password
							</Button>
						</div>
					</section>

					{/* Sign Out Section - New row, two columns */}
					<section className='md:col-span-2 rounded-xl border bg-card/50 p-6'>
						<Button
							onClick={handleSignOutAll}
							variant='destructive'
							className='w-full'
							disabled={isLoading}>
							Sign Out from All Devices
						</Button>
					</section>
				</div>

				{/* Update Dialog */}
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent
						aria-describedby={undefined}
						className='w-[95%] sm:max-w-[425px]'>
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
										className={`h-64 w-64 sm:h-80 sm:w-80 rounded-xl border-2 border-dashed transition-colors duration-200 flex flex-col items-center justify-center gap-4 ${
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
											<p className='text-xs text-muted-foreground'>
												Maximum size: 1MB
											</p>
										</div>
										{uploadProgress > 0 && (
											<div className='w-full max-w-[200px] space-y-2'>
												<div className='h-1 w-full bg-muted rounded-full overflow-hidden'>
													<div
														className='h-full bg-primary transition-all duration-200'
														style={{
															width: `${uploadProgress}%`,
														}}
													/>
												</div>
												<p className='text-xs text-center text-muted-foreground'>
													{uploadProgress}%
												</p>
											</div>
										)}
										{uploadError && (
											<p className='text-sm text-destructive mt-2'>
												{uploadError}
											</p>
										)}
									</div>
									<Input
										id='avatar-upload'
										type='file'
										accept='image/*'
										className='hidden'
										onChange={handleAvatarUpload}
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

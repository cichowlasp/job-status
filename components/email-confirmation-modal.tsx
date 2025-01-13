'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

interface EmailConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	mail: string;
}

export function EmailConfirmationModal({
	isOpen,
	onClose,
	mail,
}: EmailConfirmationModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Mail className='h-5 w-5 text-xl' />
						Email Confirmation Required
					</DialogTitle>
					<DialogDescription className='mt-2'>
						Please confirm your email address before attempting to
						log in.
					</DialogDescription>
				</DialogHeader>
				<div className='py-2'>
					<p className='text-sm '>
						We&apos;ve sent you a confirmation email to your
						registered email address{' '}
						<span className='font-bold'>({mail})</span>. Please
						check your inbox and click on the confirmation link to
						activate your account.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}

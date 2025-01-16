import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase/useSupabase';
import type { Column } from '@/app/private/layout';

export const NewColumnDialog = ({
	open,
	setOpen,
	userId,
	board,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	userId: string;
	board: Column[];
}) => {
	const [columnData, setColumnData] = useState({
		title: '',
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setColumnData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log('Submitted task data:', columnData);
		const { error } = await supabase.from('kanban_columns').insert({
			...columnData,
			user_id: userId,
			position: board.length + 1,
		});
		if (error) {
			console.error(error);
		}

		// Reset form after submission
		setColumnData({
			title: '',
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className='sm:max-w-[425px] w-[90%]'>
				<DialogHeader>
					<DialogTitle>Create New Column</DialogTitle>
					<DialogDescription>
						Fill in the details to create a column
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='title'>Column title</Label>
						<Input
							id='title'
							name='title'
							value={columnData.title}
							onChange={handleInputChange}
							placeholder='Enter column title'
						/>
					</div>
					<DialogFooter>
						<DialogClose className='w-full' asChild>
							<Button className='w-full' type='submit'>
								Create column
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

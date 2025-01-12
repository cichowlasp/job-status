import type { Task } from './TaskCard';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Column } from '@/app/private/page';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/utils/supabase/useSupabase';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { FormLabel } from './ui/form';

interface TaskDetailModalProps {
	task: Task;
	onClose: () => void;
	columns: Column[];
}

export function TaskDetailModal({
	task,
	onClose,
	columns,
}: TaskDetailModalProps) {
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className='md:w-[50%] w-[90%]'>
				<DialogHeader>
					<DialogTitle className='text-left'>
						<DialogDescription className='text-left'>
							Manage your task
						</DialogDescription>
						<Input
							className='mt-4'
							onChange={async (event) => {
								const { error } = await supabase
									.from('tasks')
									.update({
										jobTitle: event.target.value,
									})
									.eq('id', task.id);
								if (error) {
									console.error(error);
								}
							}}
							defaultValue={task.jobTitle}
						/>
					</DialogTitle>
				</DialogHeader>
				<div className='flex items-center gap-2'>
					<span className='font-semibold'>Column:</span>
					<Select
						defaultValue={
							columns.find((col) => col.id === task.columnId)
								?.id || ''
						}
						onValueChange={async (value) => {
							const { error } = await supabase
								.from('tasks')
								.update({
									columnId: value,
								})
								.eq('id', task.id);
							if (error) {
								console.error(error);
							}
						}}>
						<SelectTrigger className='md:w-[150px]  w-[100px] truncate'>
							<SelectValue placeholder='Select column' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Column</SelectLabel>
								{columns.map((column) => (
									<SelectItem
										key={column.id}
										value={column.id}>
										{column.title}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Textarea
						className='min-h-64'
						onChange={async (event) => {
							const { error } = await supabase
								.from('tasks')
								.update({ content: event.target.value })
								.eq('id', task.id);
							if (error) {
								console.error(error);
							}
						}}
						defaultValue={task.content}
					/>
				</div>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

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
			<DialogContent className=' sm:w-[50%] w-[90%]'>
				<DialogHeader>
					<DialogTitle>{task.jobTitle}</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<p className='text-muted-foreground'>{task.content}</p>
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
				</div>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

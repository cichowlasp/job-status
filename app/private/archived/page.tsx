'use client';
import { useView } from '@/components/view-provider';
import { TaskCard } from '@/components/task-card';
import { TaskList } from '@/components/list-view';
import { Archive } from 'lucide-react';

const Page = () => {
	const { tasks, openTaskDetail, board, view } = useView();
	const archivedTasks = tasks.filter((tasks) => !tasks.active);

	return (
		<div className='flex flex-col h-[calc(100vh-10rem)] mt-4 md:mt-0 overflow-hidden bg-background'>
			{archivedTasks.length === 0 ? (
				<div className='flex flex-col items-center justify-center h-full space-y-4 p-8'>
					<div className='p-4 rounded-full bg-muted'>
						<Archive className='h-8 w-8 text-muted-foreground' />
					</div>
					<div className='text-center space-y-2'>
						<p className='text-xl font-semibold'>
							No archived tasks
						</p>
						<p className='text-sm text-muted-foreground'>
							Archived tasks will appear here
						</p>
					</div>
				</div>
			) : (
				<>
					<div className='sticky top-0 flex items-center gap-3 px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10'>
						<div className='p-2 rounded-full bg-muted'>
							<Archive className='h-4 w-4 text-muted-foreground' />
						</div>
						<span className='text-sm font-medium'>
							{archivedTasks.length} archived tasks
						</span>
					</div>
					{view === 'Board' ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 md:p-6 overflow-y-auto h-full'>
							{archivedTasks.map((task, index) => (
								<TaskCard
									key={task.id || index}
									task={task}
									openTaskDetail={openTaskDetail}
								/>
							))}
						</div>
					) : (
						<div className='w-full mt-6 h-[85%] max-h-[85%] overflow-y-auto no-scrollbar'>
							<TaskList
								tasks={archivedTasks}
								board={board}
								openTaskDetail={openTaskDetail}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Page;

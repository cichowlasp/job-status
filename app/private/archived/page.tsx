'use client';
import { useView } from '@/components/view-provider';
import { TaskCard } from '@/components/task-card';

const Page = () => {
	const { tasks, openTaskDetail, board, view } = useView();
	return (
		<div className='mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[85%] overflow-y-auto'>
			{tasks
				.filter((tasks) => !tasks.active)
				.map((task, index) => {
					return (
						<TaskCard
							key={index}
							task={task}
							openTaskDetail={openTaskDetail}
						/>
					);
				})}
		</div>
	);
};

export default Page;

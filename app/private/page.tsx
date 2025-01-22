'use client';

import React from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { TaskList } from '@/components/list-view';
import { useView } from '@/components/view-provider';

const Page = () => {
	const { tasks, openTaskDetail, board, view } = useView();

	switch (view) {
		case 'Board':
			return (
				<>
					<div className='flex justify-center items-center w-full h-[90%] max-h-[90%] overflow-y-auto no-scrollbar place-self-center self-center'>
						<KanbanBoard
							tasks={tasks.filter((task) => task.active)}
							openTaskDetail={openTaskDetail}
							columns={board}
						/>
					</div>
				</>
			);
		case 'List':
			return (
				<>
					<div className='w-full mt-6 h-[85%] max-h-[85%] overflow-y-auto no-scrollbar'>
						<TaskList
							tasks={tasks.filter((task) => task.active)}
							board={board}
							openTaskDetail={openTaskDetail}
						/>
					</div>
				</>
			);
	}
};

export default Page;

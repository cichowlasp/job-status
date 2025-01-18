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
					<div className='flex justify-center items-center w-full h-[90%] max-h-[100%] overflow-y-auto no-scrollbar place-self-center self-center'>
						<KanbanBoard
							tasks={tasks}
							openTaskDetail={openTaskDetail}
							columns={board}
						/>
					</div>
				</>
			);
		case 'List':
			return (
				<>
					<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
						<TaskList
							tasks={tasks}
							board={board}
							openTaskDetail={openTaskDetail}
						/>
					</div>
				</>
			);
	}
};

export default Page;

'use client';

import React from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskList } from '@/components/List';
import { useView } from '@/components/view-provider';

const Page = () => {
	const { tasks, openTaskDetail, board, view } = useView();

	switch (view) {
		case 'Board':
			return (
				<div className='w-full flex justify-center items-center pt-12 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<KanbanBoard
						tasks={tasks}
						openTaskDetail={openTaskDetail}
						columns={board}
					/>
				</div>
			);
		case 'List':
			return (
				<div className='w-full py-3 h-[calc(100%-2rem)] overflow-y-auto no-scrollbar'>
					<TaskList
						tasks={tasks}
						board={board}
						openTaskDetail={openTaskDetail}
					/>
				</div>
			);
	}
};

export default Page;

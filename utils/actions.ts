import { supabase } from '@/utils/supabase/useSupabase';
import type { Task } from '@/components/TaskCard';
import type { Column } from '@/app/private/layout';

export const subscribeTasks = (
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
	userId: string | undefined
) => {
	return supabase
		.channel('tasks')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'tasks',
				filter: `user_id=eq.${userId}`,
			},
			(payload) => {
				switch (payload.eventType) {
					case 'INSERT':
						console.log('INSERTED', payload);
						setTasks((pre) => {
							return [...pre, payload.new as Task];
						});
						return;
					case 'UPDATE':
						console.log('UPDATE', payload);
						setTasks((pre) => {
							return pre.map((el) => {
								if (el.id === payload.new.id)
									return payload.new as Task;
								return el;
							});
						});
						return;
					case 'DELETE':
						console.log('DELETE', payload);
						setTasks((pre) => {
							return pre.filter((el) => el.id !== payload.old.id);
						});
						return;
				}
			}
		)
		.subscribe();
};

export const subscribeBoard = (
	setBoard: React.Dispatch<React.SetStateAction<Column[]>>,
	userId: string | undefined
) => {
	return supabase
		.channel('kanban_columns')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'kanban_columns',
				filter: `user_id=eq.${userId}`,
			},
			(payload) => {
				switch (payload.eventType) {
					case 'INSERT':
						console.log('INSERTED', payload);
						setBoard((pre) => {
							return [
								...pre.sort(
									(a: Column, b: Column) =>
										a.position - b.position
								),
								payload.new as Column,
							];
						});
						return;
					case 'UPDATE':
						console.log('UPDATE', payload);
						setBoard((pre) => {
							return pre
								.map((el) => {
									if (el.id === payload.new.id) {
										return payload.new as Column;
									}
									return el;
								})
								.sort(
									(a: Column, b: Column) =>
										a.position - b.position
								);
						});
						return;
					case 'DELETE':
						console.log('DELETE', payload);
						setBoard((pre) => {
							return pre.filter((el) => el.id !== payload.old.id);
						});
						return;
				}
			}
		)
		.subscribe();
};

export const subscribeView = (
	setView: React.Dispatch<React.SetStateAction<'Board' | 'List'>>,
	userId: string | undefined
) => {
	return supabase
		.channel('view')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'view',
				filter: `user_id=eq.${userId}`,
			},
			(payload) => {
				switch (payload.eventType) {
					case 'INSERT':
						console.log('INSERTED', payload);
						setView(payload.new.view as 'Board' | 'List');
						return;
					case 'UPDATE':
						console.log('UPDATE', payload);
						setView(payload.new.view as 'Board' | 'List');
						return;
				}
			}
		)
		.subscribe();
};

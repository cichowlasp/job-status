'use client';

import { useAuth } from '@/components/auth-provider';
import Loading from '@/components/loading';
import { ChevronUp } from 'lucide-react';
import { NewTaskDialog } from '@/components/new-task-dialog';
import { NewColumnDialog } from '@/components/new-column-dialog';
import { TaskDetailModal } from '@/components/task-details-modal';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { UserOptions } from '@/components/user-options';
import { useView } from '@/components/view-provider';

export interface Column {
	id: string;
	title: string;
	user_id: string;
	position: number;
}

export default function PrivatePage({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const auth = useAuth();
	const {
		loading,
		setIsNewDialogOpen,
		setIsColumnDialogOpen,
		isNewDialogOpen,
		isColumnDialogOpen,
		board,
		mobileMenu,
		setMobileMenu,
		selectedTask,
		closeTaskDetail,
	} = useView();

	if (loading) {
		return <Loading />;
	}

	return (
		<section className='px-6 lg:pl-0 py-0 h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] overflow-hidden flex relative'>
			<div className='mr-6 p-6 flex-col hidden lg:flex h-full md:w-64 max-h-full items-center bg-background border-r'>
				<UserOptions />
			</div>
			{auth?.user?.id && (
				<>
					<NewTaskDialog
						open={isNewDialogOpen}
						setOpen={setIsNewDialogOpen}
						userId={auth?.user?.id}
						board={board}
					/>
					<NewColumnDialog
						open={isColumnDialogOpen}
						setOpen={setIsColumnDialogOpen}
						userId={auth?.user?.id}
						board={board}
					/>
				</>
			)}
			{children}
			{selectedTask && (
				<TaskDetailModal
					task={selectedTask}
					onClose={closeTaskDetail}
					columns={board}
				/>
			)}
			<Drawer open={mobileMenu} onOpenChange={setMobileMenu}>
				<DrawerTrigger className='absolute bottom-4 right-4 rounded-full lg:hidden flex w-16 h-16 bg-background border items-center justify-center'>
					<ChevronUp className='h-8 w-8' />
				</DrawerTrigger>
				<DrawerContent className='h-[80%] px-6'>
					<VisuallyHidden>
						<DrawerHeader>
							<DrawerTitle>Context Menu</DrawerTitle>
							<DrawerDescription>
								User context menu
							</DrawerDescription>
						</DrawerHeader>
					</VisuallyHidden>
					<UserOptions />
				</DrawerContent>
			</Drawer>
		</section>
	);
}

'use client';

import { useAuth } from '@/components/auth-provider';
import Loading from '@/components/loading-animation';
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
import { usePathname } from 'next/navigation';

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
	const pathname = usePathname();
	const pathHeading = pathname.split('/').slice(-1)[0];
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
		<section className='px-3 md:px-6 lg:pl-0 py-0 h-[100dvh] max-h-[100dvh] flex overflow-hidden relative'>
			<div className='mr-6 p-6 flex-col hidden lg:inline-flex h-full md:w-64 max-h-full bg-background border-r'>
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

			<div className='w-full h-dvh max-w-full max-h-dvh overflow-auto'>
				<div className='flex items-center justify-between'>
					<div className='mt-2 md:mt-6 h-14 max-h-16 lg:pl-0 pl-3'>
						<div className='text-sm pt-4 lg:pt-0 font-medium h-fit'>
							{new Intl.DateTimeFormat('en-US', {
								weekday: 'short',
								month: 'long',
								day: 'numeric',
							}).format(new Date(Date.now()))}
						</div>
						<div className='text-2xl font-bold h-fit'>
							Hello, {auth.user?.user_metadata['name']}
						</div>
					</div>
					<div className='text-2xl font-bold mt-6 pr-2 capitalize'>
						{pathHeading === 'private' ? 'Home' : pathHeading}
					</div>
				</div>
				{children}
			</div>

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

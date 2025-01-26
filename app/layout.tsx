import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ViewProvider } from '@/components/view-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Task List',
	description: 'Simple task list app',
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.svg',
		apple: '/favicon.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			suppressHydrationWarning={true}
			className='w-full h-full max-w-full max-h-full'
			lang='en'>
			<body
				suppressHydrationWarning={true}
				className={
					inter.className + ' w-full h-full max-w-full max-h-full'
				}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem>
					<AuthProvider>
						<ViewProvider>{children}</ViewProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

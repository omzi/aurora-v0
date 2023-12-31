'use client';

import { ReactNode } from 'react';
import { Theme, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Next13ProgressBar } from 'next13-progressbar';

import './fonts.css';
import './globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { UserProvider } from '#/components/contexts/UserContext';
import { ModalProvider } from '#/components/providers/ModalProvider';
import { ThemeProvider } from '#/components/providers/ThemeProvider';
import { EdgeStoreProvider } from '#/lib/edgestore';

const queryClient = new QueryClient();

const RootLayout = ({ children }: { children: ReactNode }) => {
	const { theme } = useTheme();

	return (
		<QueryClientProvider client={queryClient}>
			<html
				lang="en"
				className="font-satoshi font-normal"
				suppressHydrationWarning
			>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
				</head>
				<body>
					<SessionProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							storageKey="theme"
						>
							<UserProvider>
								<EdgeStoreProvider>
									<ToastContainer
										position="bottom-right"
										autoClose={5000}
										hideProgressBar={false}
										newestOnTop
										closeOnClick
										draggable
										pauseOnHover
										theme={theme as Theme}
									/>
									<ModalProvider />
									{children}
									<Next13ProgressBar
										height="3.5px"
										color="#24a3fe"
										options={{ showSpinner: false, speed: 500 }}
										delay={0}
										startPosition={0.7}
										showOnShallow
									/>
								</EdgeStoreProvider>
							</UserProvider>
						</ThemeProvider>
					</SessionProvider>
				</body>
			</html>
		</QueryClientProvider>
	);
};

export default RootLayout;

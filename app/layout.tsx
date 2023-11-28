'use client';

import './fonts.css';
import './globals.css';
import { useTheme } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.min.css';
import { EdgeStoreProvider } from '#/lib/edgestore';
import { Theme, ToastContainer } from 'react-toastify';
import { UserProvider } from '#/components/contexts/UserContext';
import { ThemeProvider } from '#/components/providers/ThemeProvider';
import { ModalProvider } from '#/components/providers/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Next13ProgressBar } from 'next13-progressbar';

const queryClient = new QueryClient();

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang='en' className='font-kollektif' suppressHydrationWarning>
        <body>
          <SessionProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem storageKey='theme'>
              <UserProvider>
                <EdgeStoreProvider>
                  <ToastContainer
                    position='bottom-right'
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
                  <Next13ProgressBar height="3.5px" color="#24a3fe" options={{ showSpinner: false, speed: 500  }} delay={0} startPosition={0.7} showOnShallow />
                </EdgeStoreProvider>
              </UserProvider>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}

export default RootLayout;

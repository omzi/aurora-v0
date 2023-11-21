'use client';

import './fonts.css';
import './globals.css';
import { useTheme } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.min.css';
import { EdgeStoreProvider } from '#/lib/edgestore';
import { Theme, ToastContainer } from 'react-toastify';
import { ThemeProvider } from '#/components/providers/ThemeProvider';
import { ModalProvider } from '#/components/providers/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '#/components/contexts/UserContext';

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

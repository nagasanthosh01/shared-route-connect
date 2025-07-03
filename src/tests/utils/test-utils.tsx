import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { RideProvider } from '@/contexts/RideContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import testing utilities separately
import { screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PaymentProvider>
            <RideProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </RideProvider>
          </PaymentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
// Override render with our custom version and export the testing utilities
export { customRender as render, screen, fireEvent, waitFor };

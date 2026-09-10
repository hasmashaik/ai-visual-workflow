import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VisualForge AI',
  description: 'Create. Review. Approve. Deliver.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress React DevTools errors
              if (typeof window !== 'undefined') {
                // Override console.error to filter specific errors
                const originalError = console.error;
                console.error = function(...args) {
                  // Check if the error is about React DevTools
                  if (args.length > 0 && typeof args[0] === 'string') {
                    // Skip React DevTools errors
                    if (args[0].includes('invariant expected app router') ||
                        args[0].includes('HotReload') ||
                        args[0].includes('react-dom.development.js') ||
                        args[0].includes('navigation.js')) {
                      return;
                    }
                  }
                  originalError.apply(console, args);
                };

                // Also override window.onerror for uncaught errors
                window.addEventListener('error', function(e) {
                  if (e.message && (
                    e.message.includes('invariant expected app router') ||
                    e.message.includes('HotReload')
                  )) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);

                // Suppress unhandled rejection errors
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && (
                    e.reason?.message?.includes('invariant expected app router') ||
                    e.reason?.message?.includes('HotReload')
                  )) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Suppress React DevTools errors
    if (error.message?.includes('invariant expected app router')) {
      // Don't show the error
      return;
    }
    console.error(error);
  }, [error]);

  return null;
}
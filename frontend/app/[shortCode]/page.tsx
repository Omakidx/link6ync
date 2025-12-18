'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ShortUrlRedirect() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;

  useEffect(() => {
    const redirect = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        // Redirect to backend to handle the short URL and track clicks
        window.location.href = `${apiUrl}/${shortCode}`;
      } catch (error) {
        console.error('Redirect failed:', error);
        router.push('/');
      }
    };

    if (shortCode) {
      redirect();
    }
  }, [shortCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

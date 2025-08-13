
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first tool by default
    router.replace('/tools/smart-search');
  }, [router]);

  return (
     <div className="flex h-svh w-full flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <AppLogo className="h-12 w-12 text-primary" />
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <p className="mt-4 text-muted-foreground">Loading AI Mentor...</p>
    </div>
  );
}

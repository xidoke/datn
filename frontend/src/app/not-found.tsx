// not found page
"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppRouter } from '@/hooks/use-app-router';

export default function NotFound() {
  const router = useAppRouter();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6 w-full justify-start gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <h2 className="mb-6 text-lg font-semibold">Not Found</h2>
          <div className="space-y-2">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Link href="/">
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
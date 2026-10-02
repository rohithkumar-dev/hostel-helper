import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-current-path') || '';

  // Get session
  const session = await getAdminSession();

  // If not logged in and trying to access protected admin pages, redirect will be handled by subpages
  // but if session exists, provide sidebar layout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {session && <AdminSidebar username={session.username} />}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

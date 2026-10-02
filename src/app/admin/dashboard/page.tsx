import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Layers,
  FileSpreadsheet,
  Inbox,
  MessageSquare,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch metrics
  const totalSections = await prisma.section.count();
  const totalForms = await prisma.form.count();
  const totalRequests = await prisma.request.count();
  // In Hostel Helper, all submitted requests trigger WhatsApp dispatch
  const whatsappRequests = totalRequests;

  // Fetch recent requests
  const recentRequests = await prisma.request.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      section: true,
      form: true,
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            System Overview
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            HOSTEL HELPER ADMIN
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your hostel services, dynamic form builder, and monitor incoming student requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/sections"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Sections</span>
          </Link>
          <Link
            href="/admin/forms"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Form Builder</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Dashboard Cards (Section 7 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Sections */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Sections
            </span>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{totalSections}</span>
            <span className="text-xs text-slate-500">active categories</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
            <Link href="/admin/sections" className="hover:underline flex items-center gap-1">
              <span>View all sections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Total Forms */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Forms
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{totalForms}</span>
            <span className="text-xs text-slate-500">custom forms</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
            <Link href="/admin/forms" className="hover:underline flex items-center gap-1">
              <span>Configure forms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Total Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Requests
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{totalRequests}</span>
            <span className="text-xs text-slate-500">recorded</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
            <Link href="/admin/requests" className="hover:underline flex items-center gap-1">
              <span>Manage requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: WhatsApp Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              WhatsApp Requests
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{whatsappRequests}</span>
            <span className="text-xs text-slate-500">dispatches</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% WhatsApp routing</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent Student Requests</h3>
            <p className="text-xs text-slate-500">Latest incoming deliveries and service orders</p>
          </div>

          <Link
            href="/admin/requests"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No requests received yet. Submissions from the public website will appear here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50 rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Request ID</th>
                  <th className="py-3 px-4">Section / Form</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {req.requestId}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{req.form.name}</div>
                      <div className="text-xs text-slate-400">{req.section.name}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {req.studentName || '—'}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {req.contactNumber || '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

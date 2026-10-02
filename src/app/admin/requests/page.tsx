'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Phone,
  Calendar,
  Loader2,
  X,
  MessageSquare,
} from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/requests?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setStatusUpdating(true);
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      // Update state locally
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (activeRequest && activeRequest.id === id) {
        setActiveRequest({ ...activeRequest, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteRequest = async (id: string, reqId: string) => {
    if (!confirm(`Delete request ${reqId}?`)) return;

    try {
      const res = await fetch(`/api/admin/requests?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete request');
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (activeRequest && activeRequest.id === id) {
        setActiveRequest(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Request Registry
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Student Service Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time submissions from students. Every request carries a unique ID and full WhatsApp dispatch data.
          </p>
        </div>

        <div className="text-sm font-semibold text-slate-500">
          Total Requests: <strong className="text-slate-900">{requests.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, Student name, Phone, or Section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span>Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No requests found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Request ID</th>
                  <th className="py-4 px-4">Section / Form</th>
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Submitted Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Request ID */}
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {r.requestId}
                    </td>

                    {/* Section & Form */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{r.form?.name}</div>
                      <div className="text-xs text-slate-400">{r.section?.name}</div>
                    </td>

                    {/* Student Name */}
                    <td className="py-4 px-4 text-slate-700">
                      {r.studentName ? (
                        <span className="font-medium">{r.studentName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </td>

                    {/* Contact Number */}
                    <td className="py-4 px-4 font-mono text-slate-700">
                      {r.contactNumber || '—'}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveRequest(r)}
                          className="p-2 rounded-xl text-brand-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteRequest(r.id, r.requestId)}
                          className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Complete Submitted Form Data (Section 10 requirement) */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Request Details
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {activeRequest.requestId}
                </h3>
              </div>

              <button
                onClick={() => setActiveRequest(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block">Section:</span>
                <span className="font-bold text-slate-800">{activeRequest.section?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Form / Service:</span>
                <span className="font-bold text-slate-800">{activeRequest.form?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Submitted At:</span>
                <span className="font-medium text-slate-700">
                  {new Date(activeRequest.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Status:</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${getStatusBadge(
                    activeRequest.status
                  )}`}
                >
                  {activeRequest.status}
                </span>
              </div>
            </div>

            {/* Complete Submitted Values */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Complete Submitted Form Data:
              </h4>

              <div className="space-y-2">
                {activeRequest.values && activeRequest.values.length > 0 ? (
                  activeRequest.values.map((v: any) => (
                    <div
                      key={v.id || v.fieldLabel}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col"
                    >
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {v.fieldLabel}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 mt-0.5 break-words">
                        {v.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No field details recorded.</p>
                )}
              </div>
            </div>

            {/* Status Change Selector & WhatsApp direct button */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Update Request Status:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(activeRequest.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        activeRequest.status === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {activeRequest.contactNumber && (
                <a
                  href={`https://wa.me/91${activeRequest.contactNumber.replace(
                    /\D/g,
                    ''
                  )}?text=${encodeURIComponent(
                    `Hello, this is Hostel Helper regarding your request ${activeRequest.requestId}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat With Student on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

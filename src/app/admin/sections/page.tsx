'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  DoorClosed,
  Shirt,
  Store,
  Package,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Package');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openCreateModal = () => {
    setEditingSection(null);
    setName('');
    setDescription('');
    setIcon('Package');
    setImage('');
    setDisplayOrder(String(sections.length + 1));
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (sec: any) => {
    setEditingSection(sec);
    setName(sec.name);
    setDescription(sec.description);
    setIcon(sec.icon || 'Package');
    setImage(sec.image || '');
    setDisplayOrder(String(sec.displayOrder));
    setIsActive(sec.isActive);
    setModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const url = '/api/admin/sections';
      const method = editingSection ? 'PUT' : 'POST';
      const body = {
        id: editingSection ? editingSection.id : undefined,
        name,
        description,
        icon,
        image,
        displayOrder: Number(displayOrder) || 0,
        isActive,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save section');

      setStatusMessage(editingSection ? 'Section updated!' : 'Section added successfully!');
      setModalOpen(false);
      fetchSections();
    } catch (err: any) {
      alert(err.message || 'Error saving section');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSection = async (id: string, secName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${secName}"? All forms and fields inside it will also be deleted.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete section');
      fetchSections();
    } catch (err: any) {
      alert(err.message || 'Error deleting section');
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Section Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Dynamic Sections
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create or edit sections. Newly created sections appear automatically on the public homepage without any code changes!
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-md shadow-brand-500/25 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>+ ADD SECTION</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sections Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span>Loading sections...</span>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
          No sections found. Click <strong>+ ADD SECTION</strong> to create your first section.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Package className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      Order: #{sec.displayOrder}
                    </span>
                    {sec.isActive ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 tracking-tight">{sec.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {sec.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Forms: <strong>{sec.forms?.length || 0}</strong>
                  </span>
                  <span>
                    Requests: <strong>{sec._count?.requests || 0}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/service/${sec.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(sec)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit Section"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(sec.id, sec.name)}
                    className="p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Section (Section 8 requirement) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {editingSection ? 'Edit Section' : '+ ADD SECTION'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              New sections will automatically appear on the public homepage.
            </p>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MEDICINE DELIVERY"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Get medicines delivered to the hostel."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Package, Pill, Store"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Active (Visible on Website)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 transition-colors shadow-md disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

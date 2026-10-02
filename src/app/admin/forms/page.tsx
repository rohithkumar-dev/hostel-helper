'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface FieldDraft {
  label: string;
  fieldName: string;
  fieldType: string;
  placeholder: string;
  isRequired: boolean;
  options: string;
  displayOrder: number;
}

export default function AdminFormsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Form details
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [fields, setFields] = useState<FieldDraft[]>([]);

  // Temp field for adding to fields draft
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(true);
  const [fieldOptions, setFieldOptions] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [secRes, formsRes] = await Promise.all([
        fetch('/api/admin/sections'),
        fetch('/api/admin/forms'),
      ]);

      const secData = await secRes.json();
      const formsData = await formsRes.json();

      setSections(secData.sections || []);
      setForms(formsData.forms || []);

      if (secData.sections && secData.sections.length > 0 && !selectedSectionId) {
        setSelectedSectionId(secData.sections[0].id);
      }
    } catch (err) {
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddFormModal = () => {
    setFormName('');
    setFormDescription('');
    setSubmitButtonText('');
    setDisplayOrder('1');
    setFields([
      {
        label: 'Contact Number',
        fieldName: 'contactNumber',
        fieldType: 'phone',
        placeholder: 'e.g. 9876543210',
        isRequired: true,
        options: '',
        displayOrder: 1,
      },
    ]);
    setModalOpen(true);
  };

  const handleAddFieldToDraft = () => {
    if (!fieldLabel.trim()) {
      alert('Please enter a field label');
      return;
    }

    const generatedName = fieldLabel
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_');

    const newField: FieldDraft = {
      label: fieldLabel.trim(),
      fieldName: generatedName,
      fieldType,
      placeholder: fieldPlaceholder.trim(),
      isRequired: fieldRequired,
      options: fieldOptions.trim(),
      displayOrder: fields.length + 1,
    };

    setFields([...fields, newField]);

    // Reset inputs
    setFieldLabel('');
    setFieldPlaceholder('');
    setFieldType('text');
    setFieldRequired(true);
    setFieldOptions('');
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId) {
      alert('Please select a section for this form');
      return;
    }
    if (!formName.trim()) {
      alert('Please provide a form name');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field to this form');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: selectedSectionId,
          name: formName.trim().toUpperCase(),
          description: formDescription.trim(),
          submitButtonText: submitButtonText.trim() || `SUBMIT ${formName.toUpperCase()} REQUEST`,
          displayOrder: Number(displayOrder) || 1,
          fields,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create form');

      setStatusMessage(`Form "${formName}" created and published successfully!`);
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error creating form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteForm = async (id: string, name: string) => {
    if (!confirm(`Delete form "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/forms?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete form');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting form');
    }
  };

  const filteredForms = selectedSectionId
    ? forms.filter((f) => f.sectionId === selectedSectionId)
    : forms;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Dynamic Form Builder
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Forms & Custom Fields
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build custom forms with text, phone, numbers, dropdowns, checkboxes and more. Forms instantly become available on the website.
          </p>
        </div>

        <button
          onClick={openAddFormModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-md shadow-brand-500/25 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>+ ADD FORM</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
          Filter by Section:
        </span>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSectionId(sec.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSectionId === sec.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {sec.name} ({sec.forms?.length || 0})
          </button>
        ))}
      </div>

      {/* Forms List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span>Loading forms...</span>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-4">
          <p>No forms found in this section.</p>
          <button
            onClick={openAddFormModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form Now</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <span>{form.section?.name}</span>
                    <span>•</span>
                    <span>Form ID: {form.slug}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {form.name}
                  </h3>
                  {form.description && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {form.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {form.fields?.length || 0} fields
                  </span>

                  <button
                    onClick={() => handleDeleteForm(form.id, form.name)}
                    className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete Form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Fields Preview */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Configured Fields:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {form.fields?.map((f: any, idx: number) => (
                    <div
                      key={f.id || idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{f.label}</span>
                          {f.isRequired && <span className="text-red-500">*</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Type: <span className="font-mono text-brand-600">{f.fieldType}</span>
                          {f.placeholder && <span> • "{f.placeholder}"</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        #{f.displayOrder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Submit Button: <strong>"{form.submitButtonText}"</strong>
                </span>
                <Link
                  href={`/service/${form.section?.slug}?form=${form.slug}`}
                  target="_blank"
                  className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>Test this form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Dynamic Form Builder (Section 9 requirement) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-1">+ ADD FORM</h2>
            <p className="text-xs text-slate-500 mb-6">
              Create a custom form and configure its fields dynamically.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-6">
              {/* Target Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assign to Section *
                </label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Form Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Medicine Request"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SUBMIT MEDICINE REQUEST"
                    value={submitButtonText}
                    onChange={(e) => setSubmitButtonText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short description of this request form..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Dynamic Field Builder Sub-section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Form Fields ({fields.length})
                  </h4>
                </div>

                {/* List of current draft fields */}
                {fields.length === 0 ? (
                  <p className="text-xs text-slate-400 italic mb-4">
                    No fields added yet. Use the tool below to add fields to this form.
                  </p>
                ) : (
                  <div className="space-y-2 mb-6">
                    {fields.map((f, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">#{index + 1}</span>
                          <span className="font-bold text-slate-900">{f.label}</span>
                          <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-mono">
                            {f.fieldType}
                          </span>
                          {f.isRequired ? (
                            <span className="text-red-600 font-bold">REQUIRED</span>
                          ) : (
                            <span className="text-slate-400">OPTIONAL</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Field Panel */}
                <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    + Add New Field to Form
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Field Label *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Medicine Name, Room Number"
                        value={fieldLabel}
                        onChange={(e) => setFieldLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Field Type *
                      </label>
                      <select
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="textarea">Textarea</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol 650mg"
                        value={fieldPlaceholder}
                        onChange={(e) => setFieldPlaceholder(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    {(fieldType === 'dropdown' || fieldType === 'radio') && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Options (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Small, Medium, Large"
                          value={fieldOptions}
                          onChange={(e) => setFieldOptions(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={fieldRequired}
                        onChange={(e) => setFieldRequired(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600"
                      />
                      <span>Required Field (YES / NO)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleAddFieldToDraft}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 transition-colors shadow-sm"
                    >
                      + Add Field
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
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
                  {submitting ? 'Saving Form...' : 'Publish Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

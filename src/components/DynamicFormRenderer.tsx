'use client';

import React, { useState } from 'react';
import { FormFieldDefinition } from '@/types';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DynamicFormRendererProps {
  sectionSlug: string;
  sectionName: string;
  formSlug: string;
  formName: string;
  submitButtonText?: string;
  fields: FormFieldDefinition[];
  whatsappNumber?: string;
  onBack?: () => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  sectionSlug,
  sectionName,
  formSlug,
  formName,
  submitButtonText = 'SUBMIT REQUEST',
  fields,
  whatsappNumber = '6300141729',
  onBack,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.fieldName] = f.defaultValue || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((f) => {
      const val = formData[f.fieldName];
      const strVal = val !== undefined && val !== null ? String(val).trim() : '';

      if (f.isRequired && strVal.length === 0) {
        newErrors[f.fieldName] = `${f.label} is required`;
      } else if (strVal.length > 0) {
        if (f.fieldType === 'phone') {
          const digits = strVal.replace(/\D/g, '');
          if (digits.length < 10) {
            newErrors[f.fieldName] = 'Please enter a valid 10-digit phone number';
          }
        } else if (f.fieldType === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
            newErrors[f.fieldName] = 'Please enter a valid email address';
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionSlug,
          formSlug,
          fields: formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmissionResult({
        requestId: data.requestId,
        whatsappUrl: data.whatsappUrl,
      });

      // Try opening WhatsApp in a new window immediately
      const opened = window.open(data.whatsappUrl, '_blank');
      if (!opened) {
        // Popups might be blocked on mobile/safari, user can click the button in modal
        console.log('Popup blocked; direct button available in modal');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldDefinition) => {
    const error = errors[field.fieldName];
    const value = formData[field.fieldName] ?? '';

    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            id={field.fieldName}
            rows={3}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white ${
              error
                ? 'border-red-400 focus:ring-red-200 text-red-900'
                : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 text-slate-900'
            }`}
          />
        );

      case 'dropdown':
        const selectOptions = field.options ? field.options.split(',').map((o) => o.trim()) : [];
        return (
          <select
            id={field.fieldName}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white ${
              error
                ? 'border-red-400 focus:ring-red-200 text-red-900'
                : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 text-slate-900'
            }`}
          >
            <option value="">{field.placeholder || `Select ${field.label}...`}</option>
            {selectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              id={field.fieldName}
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(field.fieldName, e.target.checked ? 'Yes' : 'No')}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {field.placeholder || 'Yes, I confirm'}
            </span>
          </label>
        );

      default:
        // text, number, phone, email, date, time
        const inputType =
          field.fieldType === 'number'
            ? 'number'
            : field.fieldType === 'email'
            ? 'email'
            : field.fieldType === 'phone'
            ? 'tel'
            : field.fieldType === 'date'
            ? 'date'
            : field.fieldType === 'time'
            ? 'time'
            : 'text';

        return (
          <input
            id={field.fieldName}
            type={inputType}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white ${
              error
                ? 'border-red-400 focus:ring-red-200 text-red-900'
                : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 text-slate-900'
            }`}
          />
        );
    }
  };

  return (
    <div className="relative">
      {/* Submission Success Modal / Notification */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Request Recorded
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-3">
                Request ID: {submissionResult.requestId}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Your request details are saved. Click below to open WhatsApp with the pre-filled message and press <strong>SEND</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={submissionResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>OPEN WHATSAPP NOW</span>
              </a>

              <button
                onClick={() => {
                  setSubmissionResult(null);
                  if (onBack) onBack();
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header of Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <span>{sectionName}</span>
              <span>•</span>
              <span>SRM AP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formName}
            </h2>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Dynamic Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.fieldName} className="space-y-1.5">
              <label
                htmlFor={field.fieldName}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                {field.label}{' '}
                {field.isRequired ? (
                  <span className="text-red-500 font-bold">*</span>
                ) : (
                  <span className="text-slate-400 font-normal lowercase">(optional)</span>
                )}
              </label>

              {renderField(field)}

              {errors[field.fieldName] && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors[field.fieldName]}</span>
                </p>
              )}
            </div>
          ))}

          {/* Form Submit Button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl text-base font-black text-white bg-slate-900 hover:bg-brand-600 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>PREPARING WHATSAPP...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{submitButtonText}</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Submitting opens WhatsApp to +91 {whatsappNumber} with your pre-filled details</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

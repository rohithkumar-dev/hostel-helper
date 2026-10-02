export type FieldType =
  | 'text'
  | 'number'
  | 'phone'
  | 'email'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time';

export type RequestStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface FormFieldDefinition {
  id: string;
  formId: string;
  label: string;
  fieldName: string;
  fieldType: FieldType;
  placeholder?: string | null;
  defaultValue?: string | null;
  isRequired: boolean;
  options?: string | null; // JSON array or comma-separated
  displayOrder: number;
}

export interface FormDefinition {
  id: string;
  sectionId: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  submitButtonText: string;
  whatsappFormat?: string | null;
  displayOrder: number;
  isActive: boolean;
  fields: FormFieldDefinition[];
}

export interface SectionDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
  forms?: FormDefinition[];
}

export interface RequestItem {
  id: string;
  requestId: string; // e.g. HH-20261002-0001
  sectionId: string;
  formId: string;
  studentName?: string | null;
  contactNumber?: string | null;
  status: RequestStatus;
  additionalNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  section?: {
    id: string;
    name: string;
    slug: string;
  };
  form?: {
    id: string;
    name: string;
    slug: string;
    submitButtonText?: string;
  };
  values: {
    id?: string;
    fieldLabel: string;
    fieldName: string;
    value: string;
  }[];
}

export interface AppSettings {
  websiteName: string;
  ownerName: string;
  location: string;
  whatsappNumber: string;
  description: string;
}

export interface AdminUser {
  id: string;
  username: string;
  createdAt: string | Date;
}

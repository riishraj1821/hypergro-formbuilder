export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[]; // For dropdown fields
  minLength?: number; // For text and textarea
  maxLength?: number; // For text and textarea
  pattern?: string; // For text validation
  min?: string; // For date fields
  max?: string; // For date fields
  defaultValue?: string; // Default value for the field
}

export interface FormFieldProps {
  field: FormField;
  index: number;
  isDragging?: boolean;
  onUpdate?: (field: FormField) => void;
  onDelete?: (id: string) => void;
} 
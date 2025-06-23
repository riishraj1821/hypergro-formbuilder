import { useState } from 'react';
import { FormField } from '~/types/form';
import { showToast } from '~/utils/toast';

interface SharedFormViewProps {
  form: {
    title: string;
    fields: FormField[];
  };
}

const FormFieldRenderer = ({ 
  field,
  value,
  onChange,
  error
}: { 
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'Enter text...'}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'Enter text...'}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            rows={3}
            minLength={field.minLength}
            maxLength={field.maxLength}
            required={field.required}
          />
        );
      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className={`h-4 w-4 text-blue-600 border ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded`}
              required={field.required}
            />
            <label className="ml-2 text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            min={field.min}
            max={field.max}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {renderField()}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.helpText}</p>
      )}
    </div>
  );
};

export default function SharedFormView({ form }: SharedFormViewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && !value) {
      return 'This field is required';
    }
    if (field.minLength && value && value.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }
    if (field.maxLength && value && value.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }
    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return 'Invalid format';
    }
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast.error('Please fix the errors in the form');
      return;
    }

    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    showToast.success('Form submitted successfully!');
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {form.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, [field.id]: value }));
                // Clear error when user starts typing
                if (errors[field.id]) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field.id];
                    return newErrors;
                  });
                }
              }}
              error={errors[field.id]}
            />
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { useParams, Link } from '@remix-run/react';
import { FormField } from '~/types/form';
import Header from '~/components/Header';
import { showToast } from '~/utils/toast';

export default function PreviewForm() {
  const { formId } = useParams();
  const [formData, setFormData] = useState<{
    name: string;
    fields: FormField[];
  } | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedForm = localStorage.getItem(formId || '');
    if (savedForm) {
      const data = JSON.parse(savedForm);
      setFormData(data);
      // Initialize form values
      const initialValues: Record<string, any> = {};
      data.fields.forEach((field: FormField) => {
        initialValues[field.id] = field.defaultValue || '';
      });
      setFormValues(initialValues);
    }
  }, [formId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', formValues);
    showToast.success('Form submitted successfully!');
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Form not found
            </h1>
            <Link
              to="/my-forms"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to My Forms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/my-forms"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to My Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formData.name}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.fields.map((field) => (
            <div key={field.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  pattern={field.pattern}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              )}

              {field.type === 'dropdown' && (
                <select
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formValues[field.id] || false}
                    onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    required={field.required}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label className="ml-2 text-gray-700 dark:text-gray-300">
                    {field.placeholder || 'Checkbox option'}
                  </label>
                </div>
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              )}

              {field.helpText && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
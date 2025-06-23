import { FormField, FieldType } from '~/types/form';

interface FieldSettingsProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (id: string) => void;
}

export default function FieldSettings({ field, onUpdate, onDelete }: FieldSettingsProps) {
  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const renderTypeSpecificSettings = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Length
              </label>
              <input
                type="number"
                value={field.minLength || ''}
                onChange={(e) => handleChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Length
              </label>
              <input
                type="number"
                value={field.maxLength || ''}
                onChange={(e) => handleChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pattern (RegEx)
              </label>
              <input
                type="text"
                value={field.pattern || ''}
                onChange={(e) => handleChange('pattern', e.target.value)}
                placeholder="e.g., [A-Za-z]+"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </>
        );

      case 'dropdown':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      handleChange('options', newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index) || [];
                      handleChange('options', newOptions);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(field.options || []), ''];
                  handleChange('options', newOptions);
                }}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                + Add Option
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add multiple options by clicking the "Add Option" button
            </p>
          </div>
        );

      case 'date':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Date
              </label>
              <input
                type="date"
                value={field.min || ''}
                onChange={(e) => handleChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Date
              </label>
              <input
                type="date"
                value={field.max || ''}
                onChange={(e) => handleChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Field Settings</h3>
        <button
          onClick={() => onDelete(field.id)}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {(field.type === 'text' || field.type === 'textarea') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Help Text
          </label>
          <input
            type="text"
            value={field.helpText || ''}
            onChange={(e) => handleChange('helpText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={field.required}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>

        {renderTypeSpecificSettings()}
      </div>
    </div>
  );
} 
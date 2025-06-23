import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '~/types/form';
import FieldSettings from './FieldSettings';

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldSelect: (id: string | null) => void;
  onFieldUpdate: (field: FormField) => void;
  onFieldDelete: (id: string) => void;
  onFieldReorder: (fields: FormField[]) => void;
}

const FormFieldPreview = ({ 
  field, 
  index,
  isPreview = false
}: { 
  field: FormField; 
  index: number;
  isPreview?: boolean;
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder || 'Enter text...'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={!isPreview}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || 'Enter text...'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={3}
            disabled={!isPreview}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );
      case 'dropdown':
        return (
          <div className="space-y-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!isPreview}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {!isPreview && field.options && field.options.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {field.options.length} option{field.options.length !== 1 ? 's' : ''} available: {field.options.join(' | ')}
              </div>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
              disabled={!isPreview}
            />
            <label className="ml-2 text-gray-700 dark:text-gray-300">Checkbox option</label>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={!isPreview}
            min={field.min}
            max={field.max}
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
        {!isPreview && (
          <span className="text-xs text-gray-500 dark:text-gray-400">#{index + 1}</span>
        )}
      </div>
      {renderField()}
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.helpText}</p>
      )}
    </div>
  );
};

const SortableFormField = ({ 
  field, 
  index, 
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  totalFields
}: { 
  field: FormField; 
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  totalFields: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: field.id,
    data: {
      type: field.type,
      isToolboxItem: false
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
    touchAction: 'none' as const,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer transition-all duration-200 touch-none
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-grab active:cursor-grabbing transition-colors touch-none"
            style={{ touchAction: 'none' }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">#{index + 1}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-none"
              disabled={index === 0}
              style={{ touchAction: 'none' }}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-none"
              disabled={index === totalFields - 1}
              style={{ touchAction: 'none' }}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <FormFieldPreview field={field} index={index} isPreview={false} />
    </div>
  );
};

export default function FormCanvas({ 
  fields, 
  selectedFieldId,
  onFieldSelect,
  onFieldUpdate,
  onFieldDelete,
  onFieldReorder
}: FormCanvasProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { setNodeRef } = useDroppable({
    id: 'form-canvas',
  });

  const selectedField = fields.find(field => field.id === selectedFieldId);

  const handleMoveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    onFieldReorder(newFields);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isPreviewMode ? 'Form Preview' : 'Form Builder'}
              </h2>
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isPreviewMode ? 'Exit Preview' : 'Preview Form'}
              </button>
            </div>
            <div
              ref={setNodeRef}
              className="min-h-[calc(100vh-8rem)]"
            >
              {fields.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Drag and drop form fields here
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start building your form by dragging fields from the toolbox
                  </p>
                </div>
              ) : isPreviewMode ? (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <FormFieldPreview 
                      key={field.id} 
                      field={field} 
                      index={index}
                      isPreview={true}
                    />
                  ))}
                </div>
              ) : (
                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <SortableFormField 
                        key={field.id} 
                        field={field} 
                        index={index}
                        isSelected={field.id === selectedFieldId}
                        onClick={() => onFieldSelect(field.id)}
                        onMoveUp={() => handleMoveField(index, index - 1)}
                        onMoveDown={() => handleMoveField(index, index + 1)}
                        totalFields={fields.length}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </div>

          {selectedField && !isPreviewMode && (
            <div className="w-80">
              <FieldSettings
                field={selectedField}
                onUpdate={onFieldUpdate}
                onDelete={onFieldDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
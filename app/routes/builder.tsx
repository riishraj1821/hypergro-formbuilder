import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams, Link, MetaFunction } from "@remix-run/react";
import Header from "~/components/Header";
import FormToolbox from "~/components/FormToolbox";
import FormCanvas from "~/components/FormCanvas";
import { FormField, FieldType } from "~/types/form";
import { showToast } from '~/utils/toast';

export const meta: MetaFunction = () => {
  return [
    { title: "Form builder" },
    { name: "description", content: "Welcome to HyperGro form builder" },
  ];
};

export default function Builder() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("form") || `form_${uuidv4()}`;
  const [formName, setFormName] = useState("Untitled Form");
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempFormName, setTempFormName] = useState("");

  // Configure sensors for better touch support
  const sensors = useSensors(
    useSensor(TouchSensor, {
      // Increase activation delay for touch events to prevent accidental drags
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Load saved form from localStorage on component mount
  useEffect(() => {
    const savedForm = localStorage.getItem(formId);
    if (savedForm) {
      const formData = JSON.parse(savedForm);
      setFields(formData.fields || []);
      setFormName(formData.name || "Untitled Form");
      setIsEditing(true);
    }
  }, [formId]);

  const handleSaveClick = () => {
    setTempFormName(formName);
    setShowSaveModal(true);
  };

  const handleSaveForm = () => {
    if (!tempFormName.trim()) {
      showToast.error("Please enter a form name");
      return;
    }

    const formData = {
      name: tempFormName,
      fields,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(formId, JSON.stringify(formData));
    setFormName(tempFormName);
    setShowSaveModal(false);
    showToast.success("Form saved successfully!");
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      const isToolboxItem = active.data.current?.isToolboxItem;
      const type = active.data.current?.type as FieldType;

      if (isToolboxItem) {
        const newField: FormField = {
          id: uuidv4(),
          type,
          label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          required: false,
        };
        setFields((prev) => [...prev, newField]);
      } else {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const newFields = [...fields];
        const [movedField] = newFields.splice(oldIndex, 1);
        newFields.splice(newIndex, 0, movedField);
        setFields(newFields);
      }
    }
  };

  const handleFieldUpdate = (updatedField: FormField) => {
    setFields((prev) =>
      prev.map((field) => (field.id === updatedField.id ? updatedField : field))
    );
  };

  const handleFieldDelete = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleFieldReorder = (newFields: FormField[]) => {
    setFields(newFields);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen max-w-screen-xl mx-auto bg-white dark:bg-gray-900">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-wrap">
            <FormToolbox />
            <div className="flex-1">
              <div className="flex justify-between md:justify-between p-4 overflow-hidden">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="px-3 py-2 text-xl max-w-[200px] text-blue-500 font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="Untitled Form"
                  />
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Save Form
                  </button>
                </div>
              </div>
              <FormCanvas
                fields={fields}
                selectedFieldId={selectedFieldId}
                onFieldSelect={setSelectedFieldId}
                onFieldUpdate={handleFieldUpdate}
                onFieldDelete={handleFieldDelete}
                onFieldReorder={handleFieldReorder}
              />
            </div>
          </div>
          <DragOverlay>
            {activeDragId ? (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg opacity-80">
                {activeDragId.startsWith('toolbox-') ? (
                  <div className="text-gray-700 dark:text-gray-300">
                    {activeDragId.replace('toolbox-', '').charAt(0).toUpperCase() +
                      activeDragId.replace('toolbox-', '').slice(1)}
                  </div>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300">
                    {fields.find((f) => f.id === activeDragId)?.label}
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Save Form
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="formName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Form Name
                </label>
                <input
                  type="text"
                  id="formName"
                  value={tempFormName}
                  onChange={(e) => setTempFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter form name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveForm}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

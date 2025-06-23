import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "~/types/form";

interface ToolboxItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const ToolboxItem = ({ type, label, icon }: ToolboxItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type}`,
    data: {
      type,
      isToolboxItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-move flex items-center space-x-3 touch-none
        ${
          isDragging
            ? "opacity-50"
            : "hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
        } transition-all duration-200`}
      style={{ touchAction: "none" }}
    >
      <div className="p-1 md:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </span>
    </div>
  );
};

export default function FormToolbox() {
  const tools = [
    {
      type: "text" as FieldType,
      label: "Text Input",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      ),
    },
    {
      type: "textarea" as FieldType,
      label: "Text Area",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      ),
    },
    {
      type: "dropdown" as FieldType,
      label: "Dropdown",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ),
    },
    {
      type: "checkbox" as FieldType,
      label: "Checkbox",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      type: "date" as FieldType,
      label: "Date Picker",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-900 p-2 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Form Fields
        </h2>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {tools.length} fields
        </span>
      </div>
      <div className="overflow-x-scroll md:overflow-x-visible">
        <div className="flex md:block  md:space-x-0 pb-4 md:pb-0 gap-1">
          {tools.map((tool) => (
            <div
              key={tool.type}
              className="min-w-[160px] md:min-w-0 mb-2"
            >
              <ToolboxItem {...tool} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

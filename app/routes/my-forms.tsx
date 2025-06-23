import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { FormField } from "~/types/form";
import Header from "~/components/Header";
import { showToast } from "~/utils/toast";

interface SavedForm {
  id: string;
  name: string;
  fields: FormField[];
  lastModified: string;
}

export default function MyForms() {
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    // Load all saved forms from localStorage
    const loadSavedForms = () => {
      const forms: SavedForm[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("form_")) {
          try {
            const formData = JSON.parse(localStorage.getItem(key) || "");
            forms.push({
              id: key,
              name: formData.name || "Untitled Form",
              fields: formData.fields || [],
              lastModified: formData.lastModified || new Date().toISOString(),
            });
          } catch (error) {
            console.error("Error parsing form data:", error);
          }
        }
      }
      setSavedForms(
        forms.sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        )
      );
    };

    loadSavedForms();
  }, []);

  const handleDeleteForm = (formId: string) => {
    localStorage.removeItem(formId);
    setSavedForms((prevForms) =>
      prevForms.filter((form) => form.id !== formId)
    );
    showToast.success("Form deleted successfully");
  };

  const handleShareClick = (formId: string) => {
    setSelectedFormId(formId);
    setShowShareModal(true);
  };

  const getShareableLink = (formId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/forms/${formId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        showToast.error("Failed to copy link");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Forms
          </h1>
          <Link
            to="/builder"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create New Form
          </Link>
        </div>

        {savedForms.length === 0 ? (
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
              No forms found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new form
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedForms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {form.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {form.fields.length} field
                    {form.fields.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last modified:{" "}
                    {new Date(form.lastModified).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleShareClick(form.id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Share
                  </button>
                  <Link
                    to={`/builder?form=${form.id}`}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/preview/${form.id}`}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedFormId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Share Form
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shareable Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getShareableLink(selectedFormId)}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() =>
                    copyToClipboard(getShareableLink(selectedFormId))
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

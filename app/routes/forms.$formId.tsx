import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import SharedFormView from '~/components/SharedFormView';
import { FormField } from '~/types/form';

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.formId) {
    throw new Response('Form ID is required', { status: 400 });
  }
  return json({ formId: params.formId });
}

export default function SharedForm() {
  const { formId } = useLoaderData<typeof loader>();
  const [form, setForm] = useState<{ title: string; fields: FormField[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load the form data from localStorage
    const savedForm = localStorage.getItem(formId);
    if (savedForm) {
      try {
        const formData = JSON.parse(savedForm);
        setForm({
          title: formData.name,
          fields: formData.fields
        });
      } catch (err) {
        setError('Error loading form data');
      }
    } else {
      setError('Form not found');
    }
  }, [formId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The form you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Loading form...
          </h1>
        </div>
      </div>
    );
  }

  return <SharedFormView form={form} />;
} 
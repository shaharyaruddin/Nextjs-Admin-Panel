'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/components/common/common';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'file';
  required?: boolean;
  options?: { value: string; label: string }[];
  fetchOptions?: {
    url: string;
    valueKey: string;
    labelKey: string;
  };
}

interface ComponentCardProps<T> {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  formFields?: FormField[];
  onAddNew?: (formData: FormData) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const ComponentCard = <T,>({
  title,
  children,
  className = '',
  desc = '',
  formFields = [],
  onAddNew,
}: ComponentCardProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: SelectOption[] }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null); // Added for background_image
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null); // Added for background_image
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      const optionsData: { [key: string]: SelectOption[] } = {};
      for (const field of formFields) {
        if (field.fetchOptions) {
          try {
            const response = await axios.get(`${BASE_URL}${field.fetchOptions.url}`);
            const options = response.data.map((item: any) => {
              return {
                value: item[field.fetchOptions!.valueKey],
                label: item[field.fetchOptions!.labelKey],
              };
            });
            optionsData[field.name] = options;
          } catch (error) {
            console.error(`Error fetching options for ${field.name}:`, error);
            optionsData[field.name] = [];
          }
        }
      }
      setSelectOptions(optionsData);
    };

    fetchSelectOptions();
  }, [formFields]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fieldName === 'image') {
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else if (fieldName === 'background_image') {
        setBackgroundImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setBackgroundImagePreview(previewUrl);
      }
    } else {
      if (fieldName === 'image') {
        setImageFile(null);
        setImagePreview(null);
      } else if (fieldName === 'background_image') {
        setBackgroundImageFile(null);
        setBackgroundImagePreview(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (backgroundImagePreview) {
        URL.revokeObjectURL(backgroundImagePreview);
      }
    };
  }, [imagePreview, backgroundImagePreview]);

  const handleAddNewClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Log form data for debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Validate required fields
      const requiredFields = formFields.filter((field) => field.required).map((field) => field.name);
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate rating and age
      const rating = formData.get('rating') as string;
      if (rating && isNaN(parseFloat(rating))) {
        throw new Error('Invalid rating: must be a valid number');
      }
      const age = formData.get('age') as string;
      if (age && isNaN(parseInt(age))) {
        throw new Error('Invalid age: must be a valid integer');
      }

      // Call onAddNew with the FormData
      await onAddNew?.(formData);
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setBackgroundImageFile(null); // Reset background_image
      setBackgroundImagePreview(null); // Reset background_image preview
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
    setBackgroundImageFile(null); // Reset background_image
    setBackgroundImagePreview(null); // Reset background_image preview
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {formFields.length > 0 && (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleAddNewClick}
          >
            Add New
          </button>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
      {isModalOpen && formFields.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Add New {title.replace('Manage ', '')}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4" encType="multipart/form-data">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    {field.label}
                    {field.required ? (
                      <span className="text-red-500 ml-1">*</span>
                    ) : (
                      <span className="text-gray-400 ml-1">(optional)</span>
                    )}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
                    />
                  ) : field.type === 'select' || field.fetchOptions ? (
                    <select
                      name={field.name}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {(field.fetchOptions ? selectOptions[field.name] : field.options)?.map((option: any) => (
                        <option key={option.value || option} value={option.value || option}>
                          {option.label || option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'date' ? (
                    <input
                      type="date"
                      name={field.name}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
                    />
                  ) : field.type === 'file' ? (
                    <div>
                      <input
                        type="file"
                        name={field.name}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleImageChange(e, field.name)}
                      />
                      {(field.name === 'image' && imagePreview) || (field.name === 'background_image' && backgroundImagePreview) ? (
                        <div className="mt-2">
                          <img
                            src={(field.name === 'image' ? imagePreview : backgroundImagePreview) || undefined}
                            alt={`${field.label} Preview`}
                            className="max-w-full h-32 object-contain rounded-lg"
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
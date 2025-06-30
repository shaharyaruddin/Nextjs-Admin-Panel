import React, { useState } from "react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date"; // Added 'date' type
  required?: boolean;
  options?: string[]; // For select fields
}

interface ComponentCardProps<T> {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  formFields?: FormField[];
  onAddNew?: (newItem: T) => void;
}

const ComponentCard = <T,>({
  title,
  children,
  className = "",
  desc = "",
  formFields = [],
  onAddNew,
}: ComponentCardProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: { [key: string]: any } = {};
    formFields.forEach((field) => {
      newItem[field.name] = formData.get(field.name) as string;
    });
    if (!newItem.id) {
      newItem.id = Date.now(); // Temporary ID
    }
    onAddNew?.(newItem as T);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
      {isModalOpen && formFields.length > 0 && (
  <div className="fixed inset-0 bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
        Add New {title.replace("Manage ", "")}
      </h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-gray-500 dark:text-gray-400">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "date" ? (
              <input
                type="date"
                name={field.name}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
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
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Add
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
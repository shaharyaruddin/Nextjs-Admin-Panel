'use client';
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { BASE_URL } from '@/components/common/common';

interface Tool {
  id: number;
  name: string;
  sub_category_id: string;
  rating: number;
  comment: string | null;
  description: string;
  age: number | null;
  visit_link: string;
  pricing_plan_id: string;
  tags: string;
  release_date: string | null;
  github: string | null;
  youtube: string | null;
  X: string | null;
  facebook: string | null;
  instagram: string | null;
  image: string | null;
  background_image: string | null; // Added background_image
  createdAt: string;
  updatedAt: string;
}

interface ToolsTableProps {
  tableData: Tool[];
  setTableData: React.Dispatch<React.SetStateAction<Tool[]>>;
}

export default function ToolsTable({ tableData, setTableData }: ToolsTableProps) {
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null); // Added for background_image

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [isModalOpen]);

  // Set image and background_image previews when editing a tool
  useEffect(() => {
    if (editTool) {
      setImagePreview(editTool.image ? `${BASE_URL}${editTool.image}` : null);
      setBackgroundImagePreview(editTool.background_image ? `${BASE_URL}${editTool.background_image}` : null);
    } else {
      setImagePreview(null);
      setBackgroundImagePreview(null);
    }
  }, [editTool]);

  const handleEdit = (id: number) => {
    const tool = tableData.find((item) => item.id === id);
    if (tool) {
      setEditTool(tool);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('API DELETE /api/tool/delete payload:', { id });
      const response = await axios.delete(`${BASE_URL}/api/tool/delete`, { data: { id } });
      console.log('API DELETE /api/tool/delete response:', response.data);
      setTableData(tableData.filter((item) => item.id !== id));
      alert('Tool deleted successfully!');
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error deleting tool:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      alert(`Failed to delete tool: ${err.message}. Check console for details.`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (fieldName === 'image') {
        setImagePreview(previewUrl);
      } else if (fieldName === 'background_image') {
        setBackgroundImagePreview(previewUrl);
      }
    } else {
      if (fieldName === 'image') {
        setImagePreview(editTool?.image ? `${BASE_URL}${editTool.image}` : null);
      } else if (fieldName === 'background_image') {
        setBackgroundImagePreview(editTool?.background_image ? `${BASE_URL}${editTool.background_image}` : null);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTool) return;

    const formData = new FormData(e.currentTarget);
    formData.append('id', editTool.id.toString()); // Ensure ID is included

    try {
      console.log('API PUT /api/tool/edit payload:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.put(`${BASE_URL}/api/tool/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('API PUT /api/tool/edit response:', response.data);

      if (!response.data.tool) {
        throw new Error('No tool data in response');
      }

      setTableData(
        tableData.map((item) =>
          item.id === editTool.id
            ? {
                ...response.data.tool,
                rating: Number(response.data.tool.rating) || 0,
                age: response.data.tool.age ? Number(response.data.tool.age) : null,
                image: response.data.tool.image ?? null,
                background_image: response.data.tool.background_image ?? null, // Added background_image
                createdAt: response.data.tool.createdAt ?? item.createdAt,
                updatedAt: response.data.tool.updatedAt ?? new Date().toISOString(),
              }
            : item
        )
      );
      setIsModalOpen(false);
      setEditTool(null);
      setImagePreview(null);
      setBackgroundImagePreview(null);
      alert('Tool updated successfully!');
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error updating tool:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? (err.response.data as { message?: string }).message
          : err.message;
      alert(`Failed to update tool: ${errorMessage}. Check console for details.`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditTool(null);
    setImagePreview(null);
    setBackgroundImagePreview(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Image
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Background Image
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sub-Category ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Description
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Visit Link
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pricing Plan ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tags
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created At
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400" >
                  No tools available.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {tool.image ? (
                      <img
                        src={`${BASE_URL}${tool.image}`}
                        alt={tool.name || 'Tool Image'}
                        className="h-12 w-12 object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {tool.background_image ? (
                      <img
                        src={`${BASE_URL}${tool.background_image}`}
                        alt={tool.name || 'Background Image'}
                        className="h-12 w-12 object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {tool.name || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.sub_category_id || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.rating ?? 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.description ? tool.description.substring(0, 50) + (tool.description.length > 50 ? '...' : '') : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.visit_link ? (
                      <a href={tool.visit_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Link
                      </a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.pricing_plan_id || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.tags || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tool.id)}
                        className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                        title="Edit"
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <MdDeleteForever size={20} color="red" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isModalOpen && editTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto py-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit Tool
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4 flex-1" encType="multipart/form-data">
              {/* Image */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Tool Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleImageChange(e, 'image')}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="max-w-full h-32 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                )}
              </div>
              {/* Background Image */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Background Image
                </label>
                <input
                  type="file"
                  name="background_image"
                  accept="image/jpeg,image/png,image/gif"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleImageChange(e, 'background_image')}
                />
                {backgroundImagePreview && (
                  <div className="mt-2">
                    <img
                      src={backgroundImagePreview}
                      alt="Background Image Preview"
                      className="max-w-full h-32 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                )}
              </div>
              {/* Tool Name */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Tool Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editTool.name || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Sub-category ID */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Sub-Category ID
                </label>
                <select
                  name="sub_category_id"
                  defaultValue={editTool.sub_category_id || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  <option value="1">Web Development</option>
                  <option value="2">Mobile Development</option>
                  <option value="3">Data Science</option>
                  <option value="4">Machine Learning</option>
                  <option value="5">DevOps</option>
                </select>
              </div>
              {/* Rating */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Rating
                </label>
                <input
                  type="text"
                  name="rating"
                  defaultValue={editTool.rating ?? ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="^\d*\.?\d*$"
                  title="Please enter a valid number (e.g., 4.5)"
                />
              </div>
              {/* Comment */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Comment
                </label>
                <textarea
                  name="comment"
                  defaultValue={editTool.comment || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editTool.description || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              {/* Age */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  defaultValue={editTool.age ?? ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  pattern="^\d*$"
                  title="Please enter a valid integer"
                />
              </div>
              {/* Visit Link */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Visit Link
                </label>
                <input
                  type="text"
                  name="visit_link"
                  defaultValue={editTool.visit_link || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Pricing Plan ID */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Pricing Plan ID
                </label>
                <select
                  name="pricing_plan_id"
                  defaultValue={editTool.pricing_plan_id || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Pricing Plan</option>
                  <option value="1">Free</option>
                  <option value="2">Freemium</option>
                  <option value="3">Paid</option>
                </select>
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editTool.tags || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Release Date */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Release Date
                </label>
                <input
                  type="date"
                  name="release_date"
                  defaultValue={editTool.release_date || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* GitHub */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  GitHub URL
                </label>
                <input
                  type="text"
                  name="github"
                  defaultValue={editTool.github || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* YouTube */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  YouTube URL
                </label>
                <input
                  type="text"
                  name="youtube"
                  defaultValue={editTool.youtube || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* X (Twitter) */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  X URL
                </label>
                <input
                  type="text"
                  name="X"
                  defaultValue={editTool.X || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Facebook */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Facebook URL
                </label>
                <input
                  type="text"
                  name="facebook"
                  defaultValue={editTool.facebook || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Instagram */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="instagram"
                  defaultValue={editTool.instagram || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Buttons */}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import ToolsTable from '@/components/tables/ToolsTable';
import { BASE_URL } from '@/components/common/common';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

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

const toolFields: FormField[] = [
  { name: 'name', label: 'Tool Name', type: 'text', required: true },
  {
    name: 'sub_category_id',
    label: 'Sub-Category',
    type: 'select',
    required: true,
    options: [
      { value: '1', label: 'Web Development' },
      { value: '2', label: 'Mobile Development' },
      { value: '3', label: 'Data Science' },
      { value: '4', label: 'Machine Learning' },
      { value: '5', label: 'DevOps' },
    ],
  },
  { name: 'image', label: 'Tool Image', type: 'file', required: false },
  { name: 'background_image', label: 'Background Image', type: 'file', required: false }, // Added background_image
  { name: 'rating', label: 'Rating', type: 'text', required: true },
  { name: 'comment', label: 'Comment', type: 'textarea', required: false },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'age', label: 'Age', type: 'text', required: false },
  { name: 'visit_link', label: 'Visit Link', type: 'text', required: true },
  {
    name: 'pricing_plan_id',
    label: 'Pricing Plan',
    type: 'select',
    required: true,
    options: [
      { value: '1', label: 'Free' },
      { value: '2', label: 'Freemium' },
      { value: '3', label: 'Paid' },
    ],
  },
  { name: 'tags', label: 'Tags', type: 'text', required: true },
  { name: 'release_date', label: 'Release Date', type: 'date', required: false },
  { name: 'github', label: 'GitHub URL', type: 'text', required: false },
  { name: 'youtube', label: 'YouTube URL', type: 'text', required: false },
  { name: 'X', label: 'X URL', type: 'text', required: false },
  { name: 'facebook', label: 'Facebook URL', type: 'text', required: false },
  { name: 'instagram', label: 'Instagram URL', type: 'text', required: false },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/tools`);
        console.log('API GET /api/tools response:', response.data);
        if (!response.data.tools) {
          throw new Error('No tools data in response');
        }
        const tools = Array.isArray(response.data.tools) ? response.data.tools : [];
        const validatedTools = tools.map((tool: any) => ({
          id: tool.id ?? 0,
          name: tool.name ?? '',
          sub_category_id: tool.sub_category_id ?? '',
          rating: Number(tool.rating) || 0,
          comment: tool.comment ?? null,
          description: tool.description ?? '',
          age: tool.age ? Number(tool.age) : null,
          visit_link: tool.visit_link ?? '',
          pricing_plan_id: tool.pricing_plan_id ?? '',
          tags: tool.tags ?? '',
          release_date: tool.release_date ?? null,
          github: tool.github ?? null,
          youtube: tool.youtube ?? null,
          X: tool.X ?? null,
          facebook: tool.facebook ?? null,
          instagram: tool.instagram ?? null,
          image: tool.image ?? null,
          background_image: tool.background_image ?? null, // Added background_image
          createdAt: tool.createdAt ?? new Date().toISOString(),
          updatedAt: tool.updatedAt ?? new Date().toISOString(),
        }));
        setTableData(validatedTools);
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error fetching tools:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Failed to fetch tools: ${err.message}. Check console for details.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (formData: FormData) => {
    try {
      // Log form data for debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post(`${BASE_URL}/api/tool/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('API POST /api/tool/add response:', response.data);

      if (!response.data.data) { // Updated to match your backend response structure
        throw new Error('No tool data in response');
      }

      const addedTool: Tool = {
        ...response.data.data,
        id: response.data.data.id ?? 0,
        rating: Number(response.data.data.rating) || 0,
        age: response.data.data.age ? Number(response.data.data.age) : null,
        image: response.data.data.image ?? null,
        background_image: response.data.data.background_image ?? null, // Added background_image
        createdAt: response.data.data.createdAt ?? new Date().toISOString(),
        updatedAt: response.data.data.updatedAt ?? new Date().toISOString(),
      };
      setTableData((prevData) => [...prevData, addedTool]);
      alert('Tool added successfully!');
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error adding tool:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? (err.response.data as { message?: string }).message
          : err.message;
      alert(`Failed to add tool: ${errorMessage}. Check console for details.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tools" />
      <div className="space-y-6">
        <ComponentCard<Tool>
          title="Manage Tools"
          formFields={toolFields}
          onAddNew={handleAddNew}
        >
          <ToolsTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
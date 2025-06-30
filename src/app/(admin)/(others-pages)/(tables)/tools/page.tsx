'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ToolsTable from '@/components/tables/ToolsTable';
import { BASE_URL } from '@/components/common/common';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
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
  createdAt: string;
  updatedAt: string;
}

const toolFields: FormField[] = [
  { name: 'name', label: 'Tool Name', type: 'text', required: true },
  { name: 'sub_category_id', label: 'Sub-Category ID', type: 'text', required: true },
  { name: 'rating', label: 'Rating', type: 'text', required: true },
  { name: 'comment', label: 'Comment', type: 'textarea', required: false },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'age', label: 'Age', type: 'text', required: false },
  { name: 'visit_link', label: 'Visit Link', type: 'text', required: true },
  { name: 'pricing_plan_id', label: 'Pricing Plan ID', type: 'text', required: true },
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

  const handleAddNew = async (newTool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'sub_category_id', 'rating', 'description', 'visit_link', 'pricing_plan_id', 'tags'];
      for (const field of requiredFields) {
        if (!newTool[field as keyof typeof newTool]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate and parse numeric fields
      const ratingValue = parseFloat(newTool.rating as unknown as string);
      if (isNaN(ratingValue)) {
        throw new Error('Invalid rating: must be a valid number');
      }
      const ageValue = newTool.age ? parseInt(newTool.age as unknown as string) : null;
      if (newTool.age && ageValue !== null && isNaN(ageValue)) {
        throw new Error('Invalid age: must be a valid integer');
      }

      const payload = {
        ...newTool,
        rating: ratingValue,
        age: ageValue,
      };
      console.log('API POST /api/tool/add payload:', payload);
      const response = await axios.post(`${BASE_URL}/api/tool/add`, payload);
      console.log('API POST /api/tool/add response:', response.data);

      if (!response.data.tool) {
        throw new Error('No tool data in response');
      }

      const addedTool: Tool = {
        ...response.data.tool,
        id: response.data.tool.id ?? 0,
        rating: Number(response.data.tool.rating) || 0,
        age: response.data.tool.age ? Number(response.data.tool.age) : null,
        createdAt: response.data.tool.createdAt ?? new Date().toISOString(),
        updatedAt: response.data.tool.updatedAt ?? new Date().toISOString(),
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
      alert(`Failed to add tool: ${err.message}. Check console for details.`);
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
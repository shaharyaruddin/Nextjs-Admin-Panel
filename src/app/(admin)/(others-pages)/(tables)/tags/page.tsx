'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BASE_URL } from '@/components/common/common';
import TagsTable from '@/components/tables/tagsTable';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const tagFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/tags`);
        setTableData(response.data.tags); // Assuming API returns { tags: [...] }
      } catch (error) {
        console.error('Error fetching tags:', error);
        alert('Failed to fetch tags. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (newTag: Tag) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/tag/add`, newTag);
      setTableData((prevData) => [...prevData, response.data.tag]); // Assuming API returns { tag: {...} }
      alert('Tag added successfully!');
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag. Please try again.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Tags" />
      <div className="space-y-6">
        <ComponentCard<Tag>
          title="Manage Tags"
          formFields={tagFields}
          onAddNew={handleAddNew}
        >
          <TagsTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
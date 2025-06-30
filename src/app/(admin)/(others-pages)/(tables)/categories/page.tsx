'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CategoriesTable from '@/components/tables/CategoriesTable';
import { BASE_URL } from '@/components/common/common';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

const categoryFields: { name: string; label: string; type: "text" | "textarea" | "select"; required: boolean }[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'meta_title', label: 'Meta Title', type: 'text', required: true },
  { name: 'meta_description', label: 'Meta Description', type: 'textarea', required: true },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        console.log('res: ', response.data.categories);
        setTableData(response.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (newCategory: Category) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/category/add`, newCategory);
      setTableData((prevData) => [...prevData, response.data.category]);
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="All Categories" />
      <div className="space-y-6">
        <ComponentCard<Category>
          title="Manage Categories"
          formFields={categoryFields}
          onAddNew={handleAddNew}
        >
          <CategoriesTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
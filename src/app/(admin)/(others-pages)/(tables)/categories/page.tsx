'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CategoriesTable from '@/components/tables/CategoriesTable';
import { BASE_URL } from '@/components/common/common'
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

export default function BasicTables() {
  const [tableData, setTableData] = useState<Category[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        // console.log('res: ', response.data.categories);
        setTableData(response.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  // const handleAddNew = (newCategory: Category) => {
  //   setTableData((prevData) => [...prevData, newCategory]);
  // };

  return (
    <div>
      <PageBreadcrumb pageTitle="All Categories" />
      <div className="space-y-6">
        <ComponentCard title="Manage Categories" >
          <CategoriesTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
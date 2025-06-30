'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RoleTable from '@/components/tables/RoleTable';
import { BASE_URL } from '@/components/common/common';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

interface Role {
  id: number;
  role_name: string;
  createdAt: string;
  updatedAt: string;
}

const roleFields: FormField[] = [
  { name: 'role_name', label: 'Role Name', type: 'text', required: true },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/roles`);
        console.log('API response:', response.data.roles);
        setTableData(Array.isArray(response.data.roles) ? response.data.roles : []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to fetch roles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (newRole: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/role/add`, newRole);
      console.log('Add response:', response.data.role);
      setTableData((prevData) => [...prevData, response.data.role]);
      alert('Role added successfully!');
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Failed to add role. Please try again.');
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
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard<Role>
          title="Manage Roles"
          formFields={roleFields}
          onAddNew={handleAddNew}
        >
          <RoleTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
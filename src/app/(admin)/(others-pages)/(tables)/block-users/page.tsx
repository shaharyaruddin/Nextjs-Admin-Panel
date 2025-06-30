'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { BASE_URL } from '@/components/common/common';
import BlockUserTable from '@/components/tables/BlockUsersTable';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const userFields: FormField[] = [
  { name: 'fullname', label: 'Full Name', type: 'text', required: true },
  { name: 'username', label: 'Username', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'text', required: true },
  {
    name: 'isActive',
    label: 'Active Status',
    type: 'select',
    required: true,
    options: ['true', 'false'],
  },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/users`);
        console.log('API GET /api/users response:', response.data);
        if (!response.data.users) {
          throw new Error('No users data in response');
        }
        const users = Array.isArray(response.data.users) ? response.data.users : [];
        // Validate and transform API data to match User interface
        const validatedUsers = users.map((user: any) => ({
          id: user.id ?? 0,
          fullname: user.fullname ?? '',
          username: user.username ?? '',
          email: user.email ?? '',
          password: user.password ?? '',
          isActive: user.isActive ?? false,
          createdAt: user.createdAt ?? new Date().toISOString(),
          updatedAt: user.updatedAt ?? new Date().toISOString(),
        }));
        setTableData(validatedUsers);
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error fetching users:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Failed to fetch users: ${err.message}. Check console for details.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const payload = {
        ...newUser,
        isActive: typeof newUser.isActive === 'string' ? newUser.isActive === 'true' : Boolean(newUser.isActive),
      };
      console.log('API POST /api/user/add payload:', payload);
      const response = await axios.post(`${BASE_URL}/api/user/add`, payload);
      console.log('API POST /api/user/add response:', response.data);
      if (!response.data.user) {
        throw new Error('No user data in response');
      }
      const addedUser: User = {
        ...response.data.user,
        id: response.data.user.id ?? 0,
        createdAt: response.data.user.createdAt ?? new Date().toISOString(),
        updatedAt: response.data.user.updatedAt ?? new Date().toISOString(),
      };
      setTableData((prevData) => [...prevData, addedUser]);
      alert('User added successfully!');
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error adding user:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      alert(`Failed to add user: ${err.message}. Check console for details.`);
    }
  };

  // Filter tableData to show only inactive users
  const inactiveUsers = tableData.filter((user) => !user.isActive);

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
      <PageBreadcrumb pageTitle="All Block Users" />
      <div className="space-y-6">
        <ComponentCard<User>
          title="Manage Block Users"
          formFields={userFields}
          onAddNew={handleAddNew}
        >
          <BlockUserTable tableData={inactiveUsers} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
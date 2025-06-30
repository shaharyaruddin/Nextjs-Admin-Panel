'use client';
import React from 'react';
import axios, { AxiosError } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { MdDeleteForever } from 'react-icons/md';
import { BASE_URL } from '@/components/common/common';

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

interface BlockUserTableProps {
  tableData: User[];
  setTableData: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function BlockUserTable({ tableData, setTableData }: BlockUserTableProps) {
  const handleToggleBlock = async (user: User) => {
    const updatedUser = {
      ...user,
      isActive: !user.isActive, // Toggle isActive
      updatedAt: new Date().toISOString(),
    };

    try {
      console.log('API PUT /api/user/edit payload:', updatedUser);
      const response = await axios.put(`${BASE_URL}/api/user/edit`, updatedUser);
      console.log('API PUT /api/user/edit response:', response.data);
      if (!response.data.user) {
        throw new Error('No user data in response');
      }
      // Update tableData, but since table only shows isActive: false, unblocked users (isActive: true) will be removed
      setTableData((prevData) =>
        prevData.map((item) => (item.id === updatedUser.id ? response.data.user : item))
      );
      alert(`User ${updatedUser.isActive ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error updating user:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      alert(`Failed to update user: ${err.message}. Check console for details.`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('API DELETE /api/user/delete payload:', { id });
      const response = await axios.delete(`${BASE_URL}/api/user/delete`, { data: { id } });
      console.log('API DELETE /api/user/delete response:', response.data);
      setTableData((prevData) => prevData.filter((item) => item.id !== id));
      alert('User deleted successfully!');
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('Error deleting user:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      alert(`Failed to delete user: ${err.message}. Check console for details.`);
    }
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
                Full Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Username
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Active Status
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
                <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                  No blocked users available.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.fullname || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.username || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleBlock(user)}
                        className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                        title={user.isActive ? 'Block' : 'Unblock'}
                      >
                        {user.isActive ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
    </div>
  );
}
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
import { MdDeleteForever } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
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

interface UsersTableProps {
  tableData: User[];
  setTableData: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UsersTable({ tableData, setTableData }: UsersTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEdit = (id: number) => {
    const user = tableData.find((item) => item.id === id);
    if (user) {
      setEditUser(user);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('API DELETE /api/user/delete payload:', { id });
      const response = await axios.delete(`${BASE_URL}/api/user/delete`, { data: { id } });
      console.log('API DELETE /api/user/delete response:', response.data);
      setTableData(tableData.filter((item) => item.id !== id));
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUser: User = {
      ...editUser,
      fullname: formData.get('fullname') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      isActive: formData.get('isActive') === 'true',
      createdAt: editUser.createdAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      console.log('API PUT /api/user/edit payload:', updatedUser);
      const response = await axios.put(`${BASE_URL}/api/user/edit`, updatedUser);
      console.log('API PUT /api/user/edit response:', response.data);
      if (!response.data.user) {
        throw new Error('No user data in response');
      }
      setTableData(
        tableData.map((item) => (item.id === updatedUser.id ? response.data.user : item))
      );
      setIsModalOpen(false);
      setEditUser(null);
      alert('User updated successfully!');
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditUser(null);
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
                  No users available.
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
                        onClick={() => handleEdit(user.id)}
                        className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                        title="Edit"
                      >
                        <FaRegEdit size={20} />
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
      {isModalOpen && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overscroll-contain">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit User
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  defaultValue={editUser.fullname || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editUser.username || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editUser.email || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  defaultValue={editUser.password || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Active Status
                </label>
                <select
                  name="isActive"
                  defaultValue={editUser.isActive ? 'true' : 'false'}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
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
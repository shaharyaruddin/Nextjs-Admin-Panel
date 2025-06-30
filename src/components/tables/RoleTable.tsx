'use client';
import React, { useState } from 'react';
import axios from 'axios';
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

interface Role {
  id: number;
  role_name: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleTableProps {
  tableData: Role[];
  setTableData: React.Dispatch<React.SetStateAction<Role[]>>;
}

export default function RoleTable({ tableData, setTableData }: RoleTableProps) {
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    const role = tableData.find((item) => item.id === id);
    if (role) {
      setEditRole(role);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/role/delete`, { data: { id } });
      setTableData(tableData.filter((item) => item.id !== id));
      alert('Role deleted successfully!');
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRole) return;

    const formData = new FormData(e.currentTarget);
    const updatedRole: Role = {
      ...editRole,
      role_name: formData.get('role_name') as string,
      createdAt: editRole.createdAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(`${BASE_URL}/api/role/edit`, updatedRole);
      setTableData(
        tableData.map((item) => (item.id === updatedRole.id ? updatedRole : item))
      );
      setIsModalOpen(false);
      setEditRole(null);
      alert('Role updated successfully!');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditRole(null);
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
                Role Name
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
                Updated At
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
                <TableCell  className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                  No roles available.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {role.role_name || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(role.id)}
                        className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                        title="Edit"
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
      {isModalOpen && editRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit Role
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Role Name
                </label>
                <input
                  type="text"
                  name="role_name"
                  defaultValue={editRole.role_name || ''}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
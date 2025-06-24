import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

interface TagsTableProps {
  tableData: Tag[];
  setTableData: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export default function TagsTable({ tableData, setTableData }: TagsTableProps) {
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    const tag = tableData.find((item) => item.id === id);
    if (tag) {
      setEditTag(tag);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTag) return;

    const formData = new FormData(e.currentTarget);
    const updatedTag: Tag = {
      ...editTag,
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string | null,
      created_at: editTag.created_at, // Preserve original created_at
    };

    setTableData(
      tableData.map((item) => (item.id === updatedTag.id ? updatedTag : item))
    );
    setIsModalOpen(false);
    setEditTag(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditTag(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Slug
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Description
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

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {tag.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {tag.slug}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {tag.description ? tag.description.substring(0, 50) + "..." : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {new Date(tag.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tag.id)}
                      className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                      title="Edit"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <MdDeleteForever size={20} color="red" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit Tag
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editTag.name}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editTag.slug}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editTag.description || ""}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
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
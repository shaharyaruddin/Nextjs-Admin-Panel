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
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Testimonial {
  id: number;
  user: {
    image: string;
    name: string;
  };
  testimonial: string;
  rating: number;
  date: string;
}

interface TestimonialsTableProps {
  tableData: Testimonial[];
  setTableData: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

export default function TestimonialsTable({ tableData, setTableData }: TestimonialsTableProps) {
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    const testimonial = tableData.find((item) => item.id === id);
    if (testimonial) {
      setEditTestimonial(testimonial);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTestimonial) return;

    const formData = new FormData(e.currentTarget);
    const updatedTestimonial: Testimonial = {
      ...editTestimonial,
      user: {
        ...editTestimonial.user,
        name: formData.get("name") as string,
      },
      testimonial: formData.get("testimonial") as string,
      rating: Number(formData.get("rating")),
      date: formData.get("date") as string,
    };

    setTableData(
      tableData.map((item) => (item.id === updatedTestimonial.id ? updatedTestimonial : item))
    );
    setIsModalOpen(false);
    setEditTestimonial(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditTestimonial(null);
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
                Testimonial
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
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
            {tableData.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <Image
                        width={40}
                        height={40}
                        src={testimonial.user.image}
                        alt={testimonial.user.name}
                      />
                    </div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {testimonial.user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {testimonial.testimonial}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={testimonial.rating >= 4 ? "success" : testimonial.rating >= 3 ? "warning" : "error"}
                  >
                    {testimonial.rating}/5
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {testimonial.date}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial.id)}
                      className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                      title="Edit"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
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
      {isModalOpen && editTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit Testimonial
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editTestimonial.user.name}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Testimonial
                </label>
                <textarea
                  name="testimonial"
                  defaultValue={editTestimonial.testimonial}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={editTestimonial.rating}
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editTestimonial.date}
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
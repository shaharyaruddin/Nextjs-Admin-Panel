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

interface Pricing {
  id: number;
  plan_name: string;
  price: number;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface PricingTableProps {
  tableData: Pricing[];
  setTableData: React.Dispatch<React.SetStateAction<Pricing[]>>;
}

export default function PricingTable({ tableData, setTableData }: PricingTableProps) {
  const [editPricing, setEditPricing] = useState<Pricing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    const pricing = tableData.find((item) => item.id === id);
    if (pricing) {
      setEditPricing(pricing);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPricing) return;

    const formData = new FormData(e.currentTarget);
    const updatedPricing: Pricing = {
      ...editPricing,
      plan_name: formData.get("plan_name") as string,
      price: Number(formData.get("price")),
      features: formData.get("features")?.toString().split(",").map((f) => f.trim()) || null,
      is_active: formData.get("is_active") === "true",
      created_at: editPricing.created_at, // Preserve original created_at
    };

    setTableData(
      tableData.map((item) => (item.id === updatedPricing.id ? updatedPricing : item))
    );
    setIsModalOpen(false);
    setEditPricing(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditPricing(null);
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
                Plan Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Features
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
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
            {tableData.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {pricing.plan_name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  ${pricing.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {pricing.features ? pricing.features.join(", ").substring(0, 50) + "..." : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={pricing.is_active ? "success" : "error"}>
                    {pricing.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pricing.id)}
                      className="p-1 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                      title="Edit"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(pricing.id)}
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
      {isModalOpen && editPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Edit Pricing Plan
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="plan_name"
                  defaultValue={editPricing.plan_name}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editPricing.price}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Features (comma-separated)
                </label>
                <textarea
                  name="features"
                  defaultValue={editPricing.features?.join(", ") || ""}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400">
                  Status
                </label>
                <select
                  name="is_active"
                  defaultValue={editPricing.is_active.toString()}
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
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
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import { BASE_URL } from '@/components/common/common';

interface Tool {
  id: number; // Unique identifier for each tool
  name: string; // Tool name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the tool
  price: string; // Price of the tool (as a string with currency symbol)
  status: 'Delivered' | 'Pending' | 'Canceled'; // Status of the tool
  image: string; // URL or path to the tool image
}

export default function RecentTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        console.log('API GET /api/tools');
        const response = await axios.get(`${BASE_URL}/api/tools`);
        console.log('API GET /api/tools response:', response.data);

        let fetchedTools: any[] = [];
        if (response.data.tools && Array.isArray(response.data.tools)) {
          fetchedTools = response.data.tools;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          fetchedTools = response.data.data;
        } else {
          throw new Error('Invalid response format: missing tools or data');
        }

        // Map API response to Tool interface
        const mappedTools: Tool[] = fetchedTools
          .sort((a, b) => {
            // Sort by createdAt (descending) if available, else by id
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
            return dateB - dateA;
          })
          .slice(0, 5) // Take top 5 recent tools
          .map((tool, index) => ({
            id: tool.id || index + 1,
            name: tool.name || `Tool ${index + 1}`,
            variants: tool.variants || '1 Variant',
            category: tool.category || 'General',
            price: tool.price ? `$${Number(tool.price).toFixed(2)}` : '$0.00',
            status: (tool.status as 'Delivered' | 'Pending' | 'Canceled') || 'Pending',
            image: tool.image || '/images/product/placeholder.jpg',
          }));

        setTools(mappedTools);
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error fetching tools:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Failed to fetch tools: ${err.message}`);
        setTools([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Tools
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tools
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell  className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell  className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : tools.length === 0 ? (
              <TableRow>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  No tools found
                </TableCell>
              </TableRow>
            ) : (
              tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src={tool.image}
                          className="h-[50px] w-[50px]"
                          alt={tool.name}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {tool.name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {tool.variants}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.category}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.price}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        tool.status === 'Delivered'
                          ? 'success'
                          : tool.status === 'Pending'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {tool.status}
                    </Badge>
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
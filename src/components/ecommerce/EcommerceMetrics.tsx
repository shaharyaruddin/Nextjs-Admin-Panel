'use client';
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Badge from '../ui/badge/Badge';
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from '@/icons';
import { BASE_URL } from '@/components/common/common';

export const EcommerceMetrics = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [toolCount, setToolCount] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTools, setLoadingTools] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorTools, setErrorTools] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        console.log('API GET /api/users');
        const response = await axios.get(`${BASE_URL}/api/users`);
        console.log('API GET /api/users response:', response.data);
        if (response.data.users && Array.isArray(response.data.users)) {
          setUserCount(response.data.users.length);
        } else if (response.data.total !== undefined) {
          setUserCount(response.data.total);
        } else {
          throw new Error('Invalid response format: missing users or total');
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error fetching users:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setErrorUsers(`Failed to fetch users: ${err.message}`);
        setUserCount(0); // Fallback value
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTools = async () => {
      try {
        setLoadingTools(true);
        console.log('API GET /api/tools');
        const response = await axios.get(`${BASE_URL}/api/tools`);
        console.log('API GET /api/tools response:', response.data);
        if (response.data.tools && Array.isArray(response.data.tools)) {
          setToolCount(response.data.tools.length);
        } else if (response.data.total !== undefined) {
          setToolCount(response.data.total);
        } else {
          throw new Error('Invalid response format: missing tools or total');
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('Error fetching tools:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setErrorTools(`Failed to fetch tools: ${err.message}`);
        setToolCount(0); // Fallback value
      } finally {
        setLoadingTools(false);
      }
    };

    fetchUsers();
    fetchTools();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loadingUsers ? 'Loading...' : errorUsers ? 'Error' : userCount !== null ? userCount.toLocaleString() : 'N/A'}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Tools Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tools
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loadingTools ? 'Loading...' : errorTools ? 'Error' : toolCount !== null ? toolCount.toLocaleString() : 'N/A'}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
    </div>
  );
};
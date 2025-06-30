'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PricingTable from '@/components/tables/PricingTable';
import { BASE_URL } from '@/components/common/common';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

interface Pricing {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const pricingFields: FormField[] = [
  { name: 'name', label: 'Plan Name', type: 'text', required: true },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Pricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/pricings`);
        console.log('API response:', response.data.pricingPlans);
        // Ensure response.data.pricingPlans is an array, fallback to empty array if undefined
        setTableData(Array.isArray(response.data.pricingPlans) ? response.data.pricingPlans : []);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        setError('Failed to fetch pricing plans. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = async (newPricing: Omit<Pricing, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/pricing/add`, newPricing);
      console.log('Add response:', response.data.pricingPlan);
      setTableData((prevData) => [...prevData, response.data.pricingPlan]);
      alert('Pricing plan added successfully!');
    } catch (error) {
      console.error('Error adding pricing plan:', error);
      alert('Failed to add pricing plan. Please try again.');
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
      <PageBreadcrumb pageTitle="Pricing" />
      <div className="space-y-6">
        <ComponentCard<Pricing>
          title="Manage Pricing"
          formFields={pricingFields}
          onAddNew={handleAddNew}
        >
          <PricingTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
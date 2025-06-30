'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TestimonialsTable from '@/components/tables/TestimonialsTable';
import { BASE_URL } from '@/components/common/common';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  message: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const testimonialFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'designation', label: 'Designation', type: 'text', required: true },
  { name: 'message', label: 'Testimonial Message', type: 'textarea', required: true },
  { name: 'image', label: 'Image URL', type: 'text', required: false },
];

export default function BasicTables() {
  const [tableData, setTableData] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/testimonials`);
        console.log('res: ', response.data.testimonials);
        setTableData(response.data.testimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchData();
  }, []);

 const handleAddNew = async (newTestimonial: Testimonial) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/testimonial/add`, newTestimonial);
      setTableData((prevData) => [...prevData, response.data.testimonial]);
      alert('Testimonial added successfully!');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Failed to add testimonial. Please try again.');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="All Testimonials" />
      <div className="space-y-6">
        <ComponentCard<Testimonial>
          title="Manage Testimonials"
          formFields={testimonialFields}
          onAddNew={handleAddNew}
        >
          <TestimonialsTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
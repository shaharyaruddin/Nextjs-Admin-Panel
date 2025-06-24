'use client'
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TestimonialsTable from "@/components/tables/TestimonialsTable";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

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

// Initial table data (Order format)
const initialTableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

// Transform Order to Testimonial
const transformOrderToTestimonial = (order: Order): Testimonial => ({
  id: order.id,
  user: {
    image: order.user.image,
    name: order.user.name,
  },
  testimonial: order.projectName, // Using projectName as testimonial
  rating: order.status === "Active" ? 5 : order.status === "Pending" ? 3 : 1, // Map status to rating
  date: new Date().toISOString().split("T")[0], // Use current date or adjust as needed
});

// Transform Testimonial to Order
const transformTestimonialToOrder = (testimonial: Testimonial): Order => ({
  id: testimonial.id,
  user: {
    image: testimonial.user.image,
    name: testimonial.user.name,
    role: "Unknown", // Default role, adjust if you have a mapping
  },
  projectName: testimonial.testimonial,
  team: { images: [] }, // Default empty team, adjust if needed
  status: testimonial.rating >= 4 ? "Active" : testimonial.rating >= 3 ? "Pending" : "Cancel",
  budget: "0", // Default budget, adjust if needed
});

export default function BasicTables() {
  // Initialize tableData as Testimonial[]
  const [tableData, setTableData] = useState<Testimonial[]>(
    initialTableData.map(transformOrderToTestimonial)
  );


  return (
    <div>
      <PageBreadcrumb pageTitle="All Testimonials" />
      <div className="space-y-6">
        <ComponentCard title="Manage Testimonials" >
          <TestimonialsTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
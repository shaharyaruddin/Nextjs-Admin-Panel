'use client'
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PricingTable from "@/components/tables/PricingTable";

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

interface Pricing {
  id: number;
  plan_name: string;
  price: number;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
}

// Initial table data
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

// Transform Order to Pricing
const transformOrderToPricing = (order: Order): Pricing => ({
  id: order.id,
  plan_name: order.projectName,
  price: parseFloat(order.budget.replace("K", "")) * 1000, // Convert "3.9K" to 3900
  features: [`${order.projectName} feature`, "Support", "Updates"], // Placeholder features
  is_active: order.status !== "Cancel",
  created_at: new Date().toISOString().split("T")[0], // Use current date or adjust as needed
});

export default function BasicTables() {
  const [tableData, setTableData] = useState<Pricing[]>(
    initialTableData.map(transformOrderToPricing)
  );


  return (
    <div>
      <PageBreadcrumb pageTitle="Pricing" />
      <div className="space-y-6">
        <ComponentCard title="Manage Pricing" >
          <PricingTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
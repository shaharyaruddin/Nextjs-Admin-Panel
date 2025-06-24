'use client'
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ToolsTable from "@/components/tables/ToolsTable";

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

interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  website_url: string | null;
  pricing_model: "free" | "freemium" | "paid" | "one-time";
  category: { id: number; name: string } | null;
  subcategory: { id: number; name: string } | null;
  is_featured: boolean;
  is_approved: boolean;
  meta_title: string | null;
  meta_description: string | null;
  user: { id: number; name: string } | null;
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

// Transform Order to Tool
const transformOrderToTool = (order: Order): Tool => ({
  id: order.id,
  name: order.projectName,
  slug: order.projectName.toLowerCase().replace(/\s+/g, "-"),
  description: `${order.projectName} description.`,
  image_url: order.user.image,
  website_url: null,
  pricing_model:
    order.status === "Active" ? "freemium" : order.status === "Pending" ? "free" : "paid",
  category: { id: 1, name: "Default Category" },
  subcategory: { id: 1, name: "Default Subcategory" },
  is_featured: order.status === "Active",
  is_approved: order.status !== "Cancel",
  meta_title: `${order.projectName} Meta Title`,
  meta_description: `${order.projectName} Meta Description`,
  user: { id: order.id, name: order.user.name },
});

export default function BasicTables() {
  const [tableData, setTableData] = useState<Tool[]>(
    initialTableData.map(transformOrderToTool)
  );


  return (
    <div>
      <PageBreadcrumb pageTitle="Tools" />
      <div className="space-y-6">
        <ComponentCard title="Manage Tools" >
          <ToolsTable tableData={tableData} setTableData={setTableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
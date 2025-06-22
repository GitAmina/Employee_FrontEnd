"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import ECommerce from "@/components/Dashboard/E-commerce";
export default function DashboardPage() {
  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
}

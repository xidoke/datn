"use client";

import { UserTable } from "@/components/admin/user-table";


export default function AdminUsersPage() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">User Management</h1>
      <UserTable />
    </div>
  );
}

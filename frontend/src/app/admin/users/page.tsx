import { UserTable } from "@/components/admin/user-table";

const UsersManagementPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">User Management</h1>
      <UserTable />
    </div>
  );
};
export default UsersManagementPage;

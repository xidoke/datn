import { UserTable } from "@/components/admin/user-table";
import UsersAdminHeader from "./header";

const UsersManagementPage = () => {
  return (
    <>
      <UsersAdminHeader />
      <div className="container mx-auto px-4 py-4">
        <UserTable />
      </div>
    </>
  );
};
export default UsersManagementPage;

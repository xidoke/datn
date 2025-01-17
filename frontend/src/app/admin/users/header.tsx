"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/ui/header";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const HeaderLeft = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <>
      {isMobile && (
        <Menu
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">User Management</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

const UsersAdminHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} />
    </>
  );
};
export default UsersAdminHeader;

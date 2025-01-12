"use client";
import { useAppRouter } from "@/hooks/use-app-router";
import { useLogout } from "@/hooks/useLogout";
import { LockIcon, MailIcon, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountLockedPage() {
  const logout = useLogout();
  const router = useAppRouter();

  const handleLogout = () => {
    // Implement logout logic here
    logout();
    router.push("/");
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <LockIcon className="mx-auto mb-6 h-16 w-16 text-red-500" />
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Account Locked
        </h1>
        <p className="mb-6 text-gray-600">
          Your account has been locked for security reasons. Please contact our
          support team to resolve this issue.
        </p>
        <div className="mb-6 flex items-center justify-center">
          <MailIcon className="mr-2 h-5 w-5 text-gray-400" />
          <a
            href="mailto:do.pd200154@sis.hust.edu.vn"
            className="text-blue-500 hover:underline"
          >
            do.pd200154@sis.hust.edu.vn
          </a>
        </div>
        <div
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
}

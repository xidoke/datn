"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  cognitoId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: string;
  lastWorkspaceSlug: string | null;
}

interface UserResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function UserTable() {
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";

  const setIsActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/isActive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.status) {
        // Cập nhật trạng thái trực tiếp trong danh sách người dùng
        setUserData((prevData) => {
          if (!prevData) return null;
          const updatedUsers = prevData.users.map((user) =>
            user.id === userId ? { ...user, isActive } : user,
          );
          return { ...prevData, users: updatedUsers };
        });
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/users?page=${page}&pageSize=${pageSize}&search=${search}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        console.log(data);
        if (data.status && data.data) {
          setUserData(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    router.push(
      `/admin/users/?page=${newPage}&pageSize=${pageSize}&search=${search}`,
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/admin/users/?page=1&pageSize=${pageSize}&search=${searchTerm}`,
    );
  };

  const totalPages = userData
    ? Math.ceil(userData.totalCount / userData.pageSize)
    : 0;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={1 === page}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(page + 1, totalPages - 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === page}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Workspace</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            userData?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-6 w-6 border border-muted-foreground">
                    <AvatarImage
                      src={API_BASE_URL + user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {(user.firstName?.charAt(0).toUpperCase() ??
                        "" + user.lastName?.charAt(0).toUpperCase() ??
                        "") ||
                        user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>{user.lastWorkspaceSlug || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await setIsActive(user.id, !user.isActive);
                    }}
                    variant={user.isActive ? "destructive" : "default"}
                  >
                    {user.isActive ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {userData && (
        <div className="mt-4 flex items-center justify-between">
          {userData.totalCount > 0 ? (
            <div>
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, userData.totalCount)} of{" "}
              {userData.totalCount} users
            </div>
          ) : (
            <div>No users found</div>
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button variant={"ghost"} disabled={page === 1}>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                  />
                </Button>
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <Button variant={"ghost"} disabled={page === totalPages}>
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

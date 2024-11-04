"use client";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfile() {
  const { user, isLoading, isError, updateUser } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button onClick={() => updateUser({ username: "New Name" })}>
            Update Name
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

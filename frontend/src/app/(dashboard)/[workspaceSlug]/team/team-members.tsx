"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemberStore } from "@/stores/member/memberStore";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Search } from "lucide-react";

export function TeamMembers({ workspaceSlug }: { workspaceSlug: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    workspaceMemberMap,
    fetchWorkspaceMembers,
  } = useMemberStore();

  useEffect(() => {
    fetchWorkspaceMembers(workspaceSlug);
  }, [fetchWorkspaceMembers, workspaceSlug]);

  const members = Object.values(workspaceMemberMap[workspaceSlug] || {});
  const filteredMembers = members.filter(
    (member) =>
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${member.user.firstName} ${member.user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={API_BASE_URL + member.user.avatarUrl} />
                  <AvatarFallback>
                    {member.user.firstName?.[0]}
                    {member.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    <a href={`/${workspaceSlug}/profile/${member.id}`}>
                      {member.user.firstName} {member.user.lastName}
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Role: {member.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Joined on: {new Date(member.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

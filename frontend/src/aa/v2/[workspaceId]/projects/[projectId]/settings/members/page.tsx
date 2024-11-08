"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member {
  id: string;
  fullName: string;
  displayName: string;
  accountType: string;
  joiningDate: string;
  avatar?: string;
}

const defaultMembers: Member[] = [
  {
    id: "1",
    fullName: "Do Pham Dinh",
    displayName: "do.pd200154",
    accountType: "Admin",
    joiningDate: "September 30, 2024",
    avatar: "/placeholder.svg",
  },
];

export default function MembersPage() {
  const [members] = useState<Member[]>(defaultMembers);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Defaults</h2>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Project lead</Label>
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">do.pd200154</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default assignee</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1">do.pd200154</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label>Grant view access to all issues for guest users</Label>
              <p className="text-sm text-muted-foreground">
                This will allow guests to have view access to all the project
                issues.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Members</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-8" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add member
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Display name</TableHead>
              <TableHead>Account type</TableHead>
              <TableHead>Joining date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {member.fullName}
                  </div>
                </TableCell>
                <TableCell>{member.displayName}</TableCell>
                <TableCell>{member.accountType}</TableCell>
                <TableCell>{member.joiningDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

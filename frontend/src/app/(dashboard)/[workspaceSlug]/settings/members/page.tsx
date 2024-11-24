"use client";

import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/stores/workspaceStore";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/stores/userStore";
import { useMemberStore } from "@/stores/member/memberStore";
import { API_BASE_URL } from "@/helpers/common.helper";
import { hasPermission } from "@/helpers/permission";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const { toast } = useToast();
  const {
    currentWorkspace,
    // updateMemberRole, // TODO: Implement this function
    // removeMember, // TODO: Implement this function
    // leaveWorkspace, // TODO: Implement this function
  } = useWorkspace();
  const updateMemberRole = (...agvs: string[]) => {};
  const removeMember = (...agvs: string[]) => {};
  const leaveWorkspace = (...agvs: string[]) => {};

  const { inviteMember } = useMemberStore();
  const userPermission = currentWorkspace ? currentWorkspace.permissions : [];
  const { workspaceMemberMap, workspaceMemberIds } = useMemberStore();
  const { data: user } = useUser();
  const membersRecord = workspaceMemberMap[currentWorkspace!.slug];
  const members = workspaceMemberIds.map((id) => membersRecord[id]);
  const currentUser = members.find((member) => member.user.id === user?.id);

  console.dir(members);
  const filteredMembers = members.filter(
    (member) =>
      member.user.displayName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(currentWorkspace!.id, memberId, newRole);
      toast({
        title: "Role updated",
        description: "Member role has been updated successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(currentWorkspace!.id, memberId);
      toast({
        title: "Member removed",
        description: "Member has been removed from the workspace.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveWorkspace = async () => {
    try {
      await leaveWorkspace(currentWorkspace!.id);
      toast({
        title: "Left workspace",
        description: "You have left the workspace successfully.",
      });
      // Redirect to workspace list or home page
    } catch {
      toast({
        title: "Error",
        description: "Failed to leave workspace. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    try {
      await inviteMember(currentWorkspace!.slug, newMemberEmail, "MEMBER");
      setIsAddingMember(false);
      setNewMemberEmail("");
      toast({
        title: "Invitation sent",
        description: "An invitation has been sent to the email address.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Members</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            {hasPermission(userPermission, "INVITE_MEMBER") ? (
              <DialogTrigger asChild>
                <Button>Add member</Button>
              </DialogTrigger>
            ) : null}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add team member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleInviteMember} className="w-full">
                  Send invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full name</TableHead>
            <TableHead>Email address</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={API_BASE_URL + member.user.avatarUrl} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  {member.user.displayName}
                </div>
              </TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                {hasPermission(userPermission, "UPDATE_MEMBER_ROLE") &&
                member.user.id !== currentUser?.user.id ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleRoleChange(member.user.id, value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  member.role
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.user.id === currentUser?.user.id ? (
                      <DropdownMenuItem onClick={handleLeaveWorkspace}>
                        Leave workspace
                      </DropdownMenuItem>
                    ) : (
                      hasPermission(userPermission, "REMOVE_MEMBER") && (
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.user.id)}
                        >
                          Remove member
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

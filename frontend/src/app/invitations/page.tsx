"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const mockInvitations = [
  {
    id: "1",
    workspace: {
      name: "Design Team",
      slug: "design-team",
    },
    role: "Member",
  },
  {
    id: "2",
    workspace: {
      name: "Marketing",
      slug: "marketing",
    },
    role: "Admin",
  },
  {
    id: "3",
    workspace: {
      name: "Development",
      slug: "development",
    },
    role: "Viewer",
  },
  {
    id: "4",
    workspace: {
      name: "Sales",
      slug: "sales",
    },
    role: "Member",
  },
  {
    id: "5",
    workspace: {
      name: "Human Resources",
      slug: "hr",
    },
    role: "Admin",
  },
];

// This would be your actual invitation service
const invitationService = {
  getUserInvitations: async () => {
    // Simulating an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockInvitations;
  },
  acceptInvitations: async (invitationIds: string[]) => {
    // Simulating an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Accepted invitations:", invitationIds);
    // In a real implementation, you would make an API call here
  },
};

export default function InvitationPage() {
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const { data: invitations, error } = useSWR(
    "userInvitations",
    invitationService.getUserInvitations,
  );

  const handleInvitationToggle = (invitationId: string) => {
    setSelectedInvitations((prev) =>
      prev.includes(invitationId)
        ? prev.filter((id) => id !== invitationId)
        : [...prev, invitationId],
    );
  };

  const handleAcceptInvitations = async () => {
    if (selectedInvitations.length === 0) {
      alert("Please select at least one invitation.");
      return;
    }

    setIsJoining(true);
    try {
      await invitationService.acceptInvitations(selectedInvitations);
      // Redirect to the first accepted workspace or home
      router.push("/");
    } catch (error) {
      alert("Failed to accept invitations. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };
  if (error) return <div>Failed to load invitations</div>;
  if (!invitations) return <div>Loading...</div>;

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <div className="flex-1 overflow-auto p-8">
        {invitations.length > 0 ? (
          <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Join a workspace</h1>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={`flex cursor-pointer items-center gap-4 rounded border p-4 ${
                    selectedInvitations.includes(invitation.id)
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleInvitationToggle(invitation.id)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                    {invitation.workspace.name[0]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {invitation.workspace.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invitation.role}
                    </div>
                  </div>
                  <CheckCircle2
                    className={`ml-auto ${
                      selectedInvitations.includes(invitation.id)
                        ? "text-blue-500"
                        : "text-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleAcceptInvitations}
                disabled={isJoining || selectedInvitations.length === 0}
              >
                {isJoining ? "Joining..." : "Accept & Join"}
              </Button>
              <Link href="/">
                <Button variant="outline">Go Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-semibold">No pending invites</h1>
            <p className="mb-8">
              You can see here if someone invites you to a workspace.
            </p>
            <Link href="/">
              <Button>Back to home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

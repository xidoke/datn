"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { USER_WORKSPACES_LIST } from "@/helpers/constants/fetch-keys";
import { useAppRouter } from "@/hooks/use-app-router";
import { toast } from "@/hooks/use-toast";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { WorkspaceService } from "@/services/workspace.service";
import { useUserStore } from "@/stores/userStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Invitation } from "@/types";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";

const workspaceService = new WorkspaceService();

const UserInvitationsPage = () => {
  // states
  const [invitationsRespond, setInvitationsRespond] = useState<string[]>([]);
  const [isJoiningWorkspaces, setIsJoiningWorkspaces] = useState(false);
  // router
  const router = useAppRouter();
  //   user store
  const { data: currentUser, updateLastWorkspaceSlug } = useUserStore();
  //  workspace fetch
  const { fetchWorkspaces } = useWorkspaceStore();
  //   fetch invitations
  const {
    data: invitationResponse,
    error: invitationError,
    mutate: mutateInvitations,
    isLoading,
  } = useSWR("USER_WORKSPACE_INVITATIONS", () =>
    workspaceService.userWorkspaceInvitations(),
  );
  const { invitations, totalCount } = invitationResponse || {};

  const handleInvitation = (
    invitation: Invitation,
    action: "accept" | "withdraw" | "reject",
  ) => {
    if (action === "accept") {
      setInvitationsRespond([...invitationsRespond, invitation.id]);
    } else if (action === "withdraw") {
      setInvitationsRespond(
        invitationsRespond.filter((id) => id !== invitation.id),
      );
    }
  };

  const submitInvitations = async () => {
    if (invitationsRespond.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one invitation.",
        variant: "destructive",
      });
      return;
    }

    setIsJoiningWorkspaces(true);

    try {
      // Accept invitations
      const acceptPromises = invitationsRespond.map((invitationId) =>
        workspaceService.acceptWorkspaceInvitation(invitationId),
      );
      // TODO: fix this
      const results : any= await Promise.all(acceptPromises);

      // Update last workspace slug with the last accepted invitation
      if (results.length > 0) {
        // TODO: fix this
        const lastAcceptedWorkspace : any = results[results.length - 1];
        await updateLastWorkspaceSlug(lastAcceptedWorkspace.slug);
      }

      // Fetch updated workspaces
      await fetchWorkspaces();
      mutate(USER_WORKSPACES_LIST);

      // Mutate the invitations list
      await mutateInvitations();

      // Show success message
      toast({
        title: "Success",
        description: `Successfully joined ${results.length} workspace(s).`,
      });

      // Redirect to the last joined workspace
      if (results.length > 0) {
        router.push(`/${results[results.length - 1].slug}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error accepting invitations:", error);
      toast({
        title: "Error",
        description: "Failed to join workspaces. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoiningWorkspaces(false);
    }
  };

  return (
    <AuthenticationWrapper>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="large" />
          </div>
        ) : invitations ? (
          invitations.length > 0 ? (
            <div className="space-y-8">
              <h1 className="text-2xl font-semibold">Join a workspace</h1>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h2 className="font-semibold">
                        {invitation.workspace.name}
                      </h2>
                    </div>
                    <Button
                      onClick={() =>
                        handleInvitation(
                          invitation,
                          invitationsRespond.includes(invitation.id)
                            ? "withdraw"
                            : "accept",
                        )
                      }
                      variant={
                        invitationsRespond.includes(invitation.id)
                          ? "outline"
                          : "default"
                      }
                    >
                      {invitationsRespond.includes(invitation.id)
                        ? "Withdraw"
                        : "Accept"}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={submitInvitations}
                  disabled={
                    isJoiningWorkspaces || invitationsRespond.length === 0
                  }
                >
                  {isJoiningWorkspaces ? "Joining..." : "Accept & Join"}
                </Button>
                <Link href="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-semibold">
                No pending invites
              </h1>
              <p className="mb-8">
                You can see here if someone invites you to a workspace.
              </p>
              <Link href="/">
                <Button>Back to home</Button>
              </Link>
            </div>
          )
        ) : null}
      </div>
    </AuthenticationWrapper>
  );
};

export default UserInvitationsPage;

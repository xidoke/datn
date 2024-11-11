"use client";

import { FC, ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
// helpers
import { useAppRouter } from "@/hooks/use-app-router";
import { PageType } from "@/helpers/authentication.helper";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/stores/userStore";
import { useWorkspace } from "@/stores/workspaceStore";
import { useAuth } from "@/hooks/useAuth";

type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: PageType;
};

const isValidURL = (url: string): boolean => {
  const disallowedSchemes = /^(https?|ftp):\/\//i;
  return !disallowedSchemes.test(url);
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = (props) => {
  const pathname = usePathname();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next_path");
  // props
  const { children, pageType = PageType.AUTHENTICATED } = props;
  // hooks
  const {
    isLoading: isUserLoading,
    fetchCurrentUser,
    lastWorkspaceSlug,
  } = useUser();
  const { isAuthenticated } = useAuth();
  const {
    loader: workspacesLoader,
    workspaces,
    fetchWorkspaces,
  } = useWorkspace();

  const { isLoading: isUserSWRLoading } = useSWR(
    "USER_INFORMATION",
    async () => await fetchCurrentUser(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const { isLoading: isWorkspaceSWRLoading } = useSWR(
    "WORKSPACE_INFORMATION",
    async () => await fetchWorkspaces(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const getWorkspaceRedirectionUrl = (): string => {
    let redirectionRoute = "/profile";

    // validating the nextPath from the router query
    if (nextPath && isValidURL(nextPath.toString())) {
      redirectionRoute = nextPath.toString();
      return redirectionRoute;
    }

    // validate the last and fallback workspace_slug
    const currentWorkspaceSlug = lastWorkspaceSlug;

    // validate the current workspace_slug is available in the user's workspace list
    const isCurrentWorkspaceValid = Object.values(workspaces || {}).findIndex(
      (workspace) => workspace.slug === currentWorkspaceSlug,
    );

    if (isCurrentWorkspaceValid >= 0)
      redirectionRoute = `/${currentWorkspaceSlug}`;

    return redirectionRoute;
  };

  if (
    (isUserSWRLoading ||
      isWorkspaceSWRLoading ||
      isUserLoading ||
      workspacesLoader) &&
    !isAuthenticated
  )
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (pageType === PageType.PUBLIC) return <>{children}</>;

  if (pageType === PageType.NON_AUTHENTICATED) {
    if (!isAuthenticated) return <>{children}</>;
    else {
      if (lastWorkspaceSlug) {
        const currentRedirectRoute = getWorkspaceRedirectionUrl();
        router.push(currentRedirectRoute);
        return <></>;
      } else {
        router.push("/create-workspace");
        return <></>;
      }
    }
  }

  if (pageType === PageType.AUTHENTICATED) {
    if (isAuthenticated) {
      if (lastWorkspaceSlug) return <>{children}</>;
      else {
        router.push(
          `/create-workspace${pathname ? `?next_path=${pathname}` : ``}`,
        );
        return <></>;
      }
    } else {
      router.push(`/${pathname ? `?next_path=${pathname}` : ``}`);
      return <></>;
    }
  }

  return <>{children}</>;
};

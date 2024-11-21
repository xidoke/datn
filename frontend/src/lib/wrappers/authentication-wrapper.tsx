"use client";

import { FC, ReactNode, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/stores/userStore";
import { useWorkspace } from "@/stores/workspaceStore";
import { useAuth } from "@/hooks/useAuth";
import { useAppRouter } from "@/hooks/use-app-router";
import { PageType } from "@/helpers/authentication.helper";

type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: PageType;
};

const isValidURL = (url: string): boolean => {
  const disallowedSchemes = /^(https?|ftp):\/\//i;
  return !disallowedSchemes.test(url);
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = ({
  children,
  pageType = PageType.AUTHENTICATED,
}) => {
  const pathname = usePathname();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next_path");

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { fetchCurrentUser, lastWorkspaceSlug } = useUser();
  const { fetchWorkspaces, workspaces } = useWorkspace();

  useSWR(
    isAuthenticated ? "USER_INFORMATION" : null,
    fetchCurrentUser,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  useSWR(
    isAuthenticated ? "WORKSPACE_INFORMATION" : null,
    fetchWorkspaces,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const isLoading = isAuthLoading;
  const getWorkspaceRedirectionUrl = (): string => {
    if (nextPath && isValidURL(nextPath.toString())) {
      return nextPath.toString();
    }

    const workspaceList = Object.values(workspaces || {});
    const isCurrentWorkspaceValid = workspaceList.some(
      (workspace) => workspace.slug === lastWorkspaceSlug,
    );

    if (isCurrentWorkspaceValid) {
      return `/${lastWorkspaceSlug}`;
    } else if (workspaceList.length > 0) {
      return `/${workspaceList[0].slug}`;
    } else {
      return "/create-workspace";
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (pageType === PageType.NON_AUTHENTICATED && isAuthenticated) {
        router.push(getWorkspaceRedirectionUrl());
      } else if (pageType === PageType.AUTHENTICATED && !isAuthenticated) {
        router.push(`/${pathname ? `?next_path=${pathname}` : ""}`);
      } else if (
        pageType === PageType.AUTHENTICATED &&
        isAuthenticated &&
        !lastWorkspaceSlug
      ) {
        router.push(
          `/create-workspace${pathname ? `?next_path=${pathname}` : ""}`,
        );
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    pageType,
    lastWorkspaceSlug,
    pathname,
    router,
  ]);

  if (pageType === PageType.PUBLIC) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div
        className="relative flex h-screen w-full items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner />
      </div>
    );
  }
  if (pageType === PageType.NON_AUTHENTICATED && !isAuthenticated) {
    return <>{children}</>;
  }

  if (
    pageType === PageType.AUTHENTICATED &&
    isAuthenticated &&
    lastWorkspaceSlug
  ) {
    return <>{children}</>;
  }

  return null;
};

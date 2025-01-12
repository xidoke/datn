"use client";
import { FC, ReactNode } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/userStore";
import { useWorkspace } from "@/stores/workspaceStore";
import { PageType } from "@/helpers/authentication.helper";
import AdminAccessRequired from "@/components/admin-access-required";

type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: PageType;
};

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = ({
  children,
  pageType = PageType.AUTHENTICATED,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next_path");

  const {
    fetchCurrentUser,
    lastWorkspaceSlug,
    isLoading: isUserLoading,
    data: user,
  } = useUserStore();
  // const {
  //   isAuthenticated ,
  // } = useAuthStore();
  const { workspaces, loader: workspaceLoading } = useWorkspace();

  const isAuthenticated = user?.id;
  const { isLoading: isUserSWRLoading } = useSWR(
    // () => isAuthenticated? "USER_INFORMATION" : null,
    "USER_INFORMATION",
    async () => await fetchCurrentUser(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const isLoading = isUserLoading || workspaceLoading || isUserSWRLoading;

  const getWorkspaceRedirectionUrl = (): string => {
    let redirectionRoute = "/create-workspace";

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
    else if (!!workspaces && workspaces.length > 0) {
      redirectionRoute = `/${workspaces[0].slug}`;
    }

    return redirectionRoute;
  };

  if (isLoading && !isAuthenticated) {
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

  if (user?.role === "ADMIN") {
    if (pathname === "/") {
      router.push("/admin/");
      return;
    }
  }

  if (user?.isActive === false) {
    if (pathname === "/") {
      router.push("/blocked/");
      return;
    }
  }

  if (pageType === PageType.PUBLIC) {
    return <>{children}</>;
  }

  if (pageType === PageType.NON_AUTHENTICATED) {
    if (!isAuthenticated) {
      return <>{children}</>;
    }
    const currentRedirectRoute = getWorkspaceRedirectionUrl();
    console.log("Redirecting to", currentRedirectRoute);
    router.push(currentRedirectRoute);
    return <></>;
  }

  if (pageType === PageType.ADMIN) {
    if (user?.role === "ADMIN") {
      return <>{children}</>;
    } else {
      return <AdminAccessRequired />;
    }
  }

  if (pageType === PageType.AUTHENTICATED) {
    if (isAuthenticated) {
      return <>{children}</>;
    } else {
      router.push(`/${pathname ? `?next_path=${pathname}` : ``}`);
      return <></>;
    }
  }

  return <>{children}</>;
};

"use client";

import { FC, ReactNode, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { isValidUrl } from "../utils/validation-utils";
import { PageType } from "@/helpers/authentication.helper";
import { useAppRouter } from "@/hooks/use-app-router";

interface AuthenticationWrapperProps {
  children: ReactNode;
  pageType?: PageType;
}

export const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
  children,
  pageType = PageType.AUTHENTICATED,
}) => {
  const pathname = usePathname();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next_path");

  const { isLoading, isAuthenticated } = useAuth();

  const getRedirectionUrl = (): string => {
    if (nextPath && isValidUrl(nextPath)) {
      return nextPath;
    }

    if (isAuthenticated) {
      return "/dashboard";
    }

    return "/login";
  };

  useEffect(() => {
    const handleAuthRedirection = async () => {
      if (isLoading) return;

      switch (pageType) {
        case PageType.PUBLIC:
          // Public pages are accessible to everyone
          break;

        case PageType.NON_AUTHENTICATED:
          if (isAuthenticated) {
            router.push(getRedirectionUrl());
          }
          break;

        case PageType.AUTHENTICATED:
          if (!isAuthenticated) {
            router.push(`/login${pathname ? `?next_path=${pathname}` : ""}`);
          }
          break;
      }
    };

    handleAuthRedirection();
  }, [isAuthenticated, isLoading, pageType, pathname, router]);

  if (isLoading && pageType !== PageType.NON_AUTHENTICATED) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (pageType === PageType.PUBLIC) return <>{children}</>;

  if (pageType === PageType.NON_AUTHENTICATED) {
    if (!isAuthenticated) return <>{children}</>;
    else {
      router.push(getRedirectionUrl());
      return null;
    }
  }

  if (pageType === PageType.AUTHENTICATED && isAuthenticated)
    return <>{children}</>;

  return null;
};

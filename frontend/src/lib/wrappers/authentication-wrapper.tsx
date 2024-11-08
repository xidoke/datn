// "use client";

// import { FC, ReactNode, useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { Spinner } from "@/components/ui/spinner";
// import { isValidUrl } from "../utils/validation-utils";
// import { PageType } from "@/helpers/authentication.helper";
// import { useAppRouter } from "@/hooks/use-app-router";

// interface AuthenticationWrapperProps {
//   children: ReactNode;
//   pageType?: PageType;
// }

// export const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
//   children,
//   pageType = PageType.AUTHENTICATED,
// }) => {
//   const pathname = usePathname();
//   const router = useAppRouter();
//   const searchParams = useSearchParams();
//   const nextPath = searchParams.get("next_path");

//   const { isLoading, isAuthenticated} = useAuth();

//   const getRedirectionUrl = (): string => {
//     if (nextPath && isValidUrl(nextPath)) {
//       return nextPath;
//     }

//     if (isAuthenticated) {
//       // if (user?.lastWorkspaceSlug) {
//       //   return `/${user.lastWorkspaceSlug}`;
//       // } else {
//       //   return "/create-workspace";
//       // }
//       return "/dashboard";
//     }


//     return "/login";
//   };

//   useEffect(() => {
//     const handleAuthRedirection = async () => {
//       if (isLoading) return;

//       switch (pageType) {
//         case PageType.PUBLIC:
//           // Public pages are accessible to everyone
//           break;

//         case PageType.NON_AUTHENTICATED:
//           if (isAuthenticated) {
//             router.push(getRedirectionUrl());
//           }
//           break;

//         case PageType.AUTHENTICATED:
//           if (!isAuthenticated) {
//             router.push(`/login${pathname ? `?next_path=${pathname}` : ""}`);
//           }
//           break;
//       }
//     };

//     handleAuthRedirection();
//   }, [isAuthenticated, isLoading, pageType, pathname, router]);

//   if (isLoading && pageType !== PageType.NON_AUTHENTICATED) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   if (pageType === PageType.PUBLIC) return <>{children}</>;

//   if (pageType === PageType.NON_AUTHENTICATED) {
//     if (!isAuthenticated) return <>{children}</>;
//     else {
//       router.push(getRedirectionUrl());
//       return null;
//     }
//   }

//   if (pageType === PageType.AUTHENTICATED && isAuthenticated)
//     return <>{children}</>;

//   return null;
// };


"use client";

import { FC, ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
// helpers
import { useAppRouter } from "@/hooks/use-app-router";
import { PageType } from "@/helpers/authentication.helper";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/stores/userStore";


type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: PageType;
};

const isValidURL = (url: string): boolean => {
  const disallowedSchemes = /^(https?|ftp):\/\//i;
  return !disallowedSchemes.test(url);
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = (
  (props) => {
    const pathname = usePathname();
    const router = useAppRouter();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next_path");
    // props
    const { children, pageType = PageType.AUTHENTICATED } = props;
    // hooks
    const {
      isLoading: isUserLoading,
      data: currentUser,
      fetchCurrentUser,
      lastWorkspaceSlug,
    } = useUser();
    const { loader: workspacesLoader, workspaces } = useWorkspace();

    const { isLoading: isUserSWRLoading } = useSWR(
      "USER_INFORMATION",
      async () => await fetchCurrentUser(),
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
      const currentWorkspaceSlug = lastWorkspaceSlug

      // validate the current workspace_slug is available in the user's workspace list
      const isCurrentWorkspaceValid = Object.values(workspaces || {}).findIndex(
        (workspace) => workspace.slug === currentWorkspaceSlug,
      );

      if (isCurrentWorkspaceValid >= 0)
        redirectionRoute = `/${currentWorkspaceSlug}`;

      return redirectionRoute;
    };

    if (
      (isUserSWRLoading || isUserLoading || workspacesLoader) &&
      !currentUser?.id
    )
      return (
        <div className="relative flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      );

    if (pageType === PageType.PUBLIC) return <>{children}</>;

    if (pageType === PageType.NON_AUTHENTICATED) {
      if (!currentUser?.id) return <>{children}</>;
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
      if (currentUser?.id) {
        if (lastWorkspaceSlug)
          return <>{children}</>;
        else {
          router.push(`/onboarding`);
          return <></>;
        }
      } else {
        router.push(`/${pathname ? `?next_path=${pathname}` : ``}`);
        return <></>;
      }
    }

    return <>{children}</>;
  },
);

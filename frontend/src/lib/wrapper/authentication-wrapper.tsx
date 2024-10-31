'use client';

import { FC, ReactNode, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
// components
import { LogoSpinner } from '@/components/common';
// helpers
import { EPageTypes } from '@/helpers/authentication.helper';
// stores and hooks
import { useUser } from '@/store/useUserStore';
import { useUserProfile } from '@/stores/useUserProfileStore';
import { useUserSettings } from '@/stores/useUserSettingsStore';
import { useWorkspace } from '@/stores/useWorkspaceStore';
import { useAppRouter } from '@/hooks/use-app-router';

type TPageType = EPageTypes;

type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: TPageType;
};

const isValidURL = (url: string): boolean => {
  const disallowedSchemes = /^(https?|ftp):\/\//i;
  return !disallowedSchemes.test(url);
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = (props) => {
  const pathname = usePathname();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next_path');
  // props
  const { children, pageType = EPageTypes.AUTHENTICATED } = props;
  // hooks
  const { user, isLoading: isUserLoading, error: userError } = useUser();
  const { userProfile } = useUserProfile();
  const { userSettings } = useUserSettings();
  const { workspaces } = useWorkspace();

  const isUserOnboard =
    userProfile?.is_onboarded ||
    (userProfile?.onboarding_step?.profile_complete &&
      userProfile?.onboarding_step?.workspace_create &&
      userProfile?.onboarding_step?.workspace_invite &&
      userProfile?.onboarding_step?.workspace_join) ||
    false;

  const getWorkspaceRedirectionUrl = (): string => {
    let redirectionRoute = '/profile';

    // validating the nextPath from the router query
    if (nextPath && isValidURL(nextPath.toString())) {
      redirectionRoute = nextPath.toString();
      return redirectionRoute;
    }

    // validate the last and fallback workspace_slug
    const currentWorkspaceSlug =
      userSettings?.workspace?.last_workspace_slug ||
      userSettings?.workspace?.fallback_workspace_slug;

    // validate the current workspace_slug is available in the user's workspace list
    const isCurrentWorkspaceValid = Object.values(workspaces || {}).findIndex(
      (workspace) => workspace.slug === currentWorkspaceSlug
    );

    if (isCurrentWorkspaceValid >= 0)
      redirectionRoute = `/${currentWorkspaceSlug}`;

    return redirectionRoute;
  };

  if (isUserLoading && !user?.id)
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <LogoSpinner />
      </div>
    );

  if (pageType === EPageTypes.PUBLIC) return <>{children}</>;

  if (pageType === EPageTypes.NON_AUTHENTICATED) {
    if (!user?.id) return <>{children}</>;
    else {
      if (userProfile?.id && isUserOnboard) {
        const currentRedirectRoute = getWorkspaceRedirectionUrl();
        router.push(currentRedirectRoute);
        return <></>;
      } else {
        router.push('/onboarding');
        return <></>;
      }
    }
  }

  if (pageType === EPageTypes.ONBOARDING) {
    if (!user?.id) {
      router.push(`/${pathname ? `?next_path=${pathname}` : ``}`);
      return <></>;
    } else {
      if (user && userProfile?.id && isUserOnboard) {
        const currentRedirectRoute = getWorkspaceRedirectionUrl();
        router.replace(currentRedirectRoute);
        return <></>;
      } else return <>{children}</>;
    }
  }

  if (pageType === EPageTypes.SET_PASSWORD) {
    if (!user?.id) {
      router.push(`/${pathname ? `?next_path=${pathname}` : ``}`);
      return <></>;
    } else {
      if (
        user &&
        !user?.is_password_autoset &&
        userProfile?.id &&
        isUserOnboard
      ) {
        const currentRedirectRoute = getWorkspaceRedirectionUrl();
        router.push(currentRedirectRoute);
        return <></>;
      } else return <>{children}</>;
    }
  }

  if (pageType === EPageTypes.AUTHENTICATED) {
    if (user?.id) {
      if (userProfile && userProfile?.id && isUserOnboard)
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
};

"use client";

import { PageType } from "@/helpers/authentication.helper";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { useUser } from "@/stores/userStore";
import { useEffect } from "react";

const WorkspacePage = () => {
  const { fetchCurrentUser, data: user, isLoading, error } = useUser();

  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, user]);

  return (
    <AuthenticationWrapper pageType={PageType.AUTHENTICATED}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {user && (
          <pre className="overflow-auto p-4">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}
      </div>
    </AuthenticationWrapper>
  );
};

export default WorkspacePage;

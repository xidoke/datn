"use client";
import { PageType } from "@/helpers/authentication.helper";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";

const WorkspacePage = () => {
  return (
    <AuthenticationWrapper pageType={PageType.AUTHENTICATED}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      </div>
    </AuthenticationWrapper>
  );
};
export default WorkspacePage;

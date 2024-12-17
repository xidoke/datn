import { ReactNode } from "react";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { PageType } from "@/helpers/authentication.helper";

const WorkspaceLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <AuthenticationWrapper pageType={PageType.ADMIN}>
      <main className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-backdrop">
        {children}
      </main>
    </AuthenticationWrapper>
  );
};
export default WorkspaceLayout;

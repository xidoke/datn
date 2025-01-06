import Image from "next/image";

import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { PageType } from "@/helpers/authentication.helper";
import LoginForm from "@/components/auth/LoginForm";

export default function HomePage() {
  return (
    <AuthenticationWrapper pageType={PageType.NON_AUTHENTICATED}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginForm />
        <div className="hidden bg-muted lg:block">
          <Image
            src="/image/auth/login.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </AuthenticationWrapper>
  );
}

"use client";
import { useLogout } from "@/hooks/useLogout";
// logout client button

import { Button } from "../ui/button";
import { useAppRouter } from "@/hooks/use-app-router";

export const LogoutButton = () => {
  const router = useAppRouter();
  const handleLogout = useLogout();

  return (
    <Button
      onClick={() => {
        handleLogout();
        router.replace("/");
      }}
      className="text-sm"
      variant={"outline"}
    >
      Log out
    </Button>
  );
};

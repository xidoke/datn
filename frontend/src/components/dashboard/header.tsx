"use client"
import { useUserStore } from "@/stores/userStore";

const Header = ({ formattedDate }: { formattedDate: string }) => {
  const { data: user } = useUserStore();

  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-2xl font-semibold">
        Welcome, {user?.firstName ?? ""} {user?.lastName ?? ""}
      </h1>
      <p className="text-muted-foreground">{formattedDate}</p>
    </div>
  );
};

export default Header;

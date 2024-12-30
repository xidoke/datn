import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/ui/header";
import { useSidebar } from "@/components/ui/sidebar";
import { useMemberStore } from "@/stores/member/memberStore";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";

const HeaderLeft = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { workspaceMemberMap } = useMemberStore();
  const { memberId, workspaceSlug } = useParams();
  const member =
    workspaceMemberMap[workspaceSlug as string]?.[memberId as string];
  return (
    <>
      {isMobile && (
        <Menu
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              {member?.user?.email}&lsquo;s work
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

const ProfileHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} />
    </>
  );
};
export default ProfileHeader;

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/ui/header";

const HeaderLeft = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const WorkspaceHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} />
    </>
  );
};
export default WorkspaceHeader;

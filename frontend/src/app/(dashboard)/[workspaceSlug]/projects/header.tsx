import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { FolderOpenDot } from "lucide-react";

const HeaderLeft = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {/*add Project Icon */}
          <FolderOpenDot />
          Projects
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const HeaderRight = () => {
  return (
    <div>
        
      <CreateProjectDialog>
        <Button size={"sm"}>Add Project</Button>
      </CreateProjectDialog>
    </div>
  );
};

const ListProjectHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} right={<HeaderRight />} />
    </>
  );
};
export default ListProjectHeader;

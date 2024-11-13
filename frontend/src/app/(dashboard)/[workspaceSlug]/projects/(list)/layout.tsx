import { ContentWrapper } from "@/components/content-wrapper"
import ListProjectHeader from "./header"
import ListProjectPage from "./page";
import { ProjectsBaseHeader } from "@/components/plane/projects/header";

const ListProjectLayout = () => {
  return (
    <>
      {/* <ListProjectHeader /> */}
      <ProjectsBaseHeader />
      <ContentWrapper>
        <ListProjectPage />
      </ContentWrapper>
    </>
  );
}
export default ListProjectLayout;
import { ContentWrapper } from "@/components/content-wrapper"
import ListProjectHeader from "./header"
import ListProjectPage from "./page";

const ListProjectLayout = () => {
  return (
    <>
      <ListProjectHeader />
      <ContentWrapper>
        <ListProjectPage />
      </ContentWrapper>
    </>
  );
}
export default ListProjectLayout;
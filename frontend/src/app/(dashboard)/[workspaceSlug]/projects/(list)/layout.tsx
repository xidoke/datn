import { ContentWrapper } from "@/components/content-wrapper"
import ListProjectHeader from "./header"
import ListProjectPage from "./page";

const ListProjectLayout = () => {
  return (
    <>
      <ListProjectHeader />
      <ContentWrapper>
        <div className="h-screen w-full">
          <ListProjectPage />
        </div>
      </ContentWrapper>
    </>
  );
}
export default ListProjectLayout;
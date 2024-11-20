import { ContentWrapper } from "@/components/content-wrapper";
import IssueListHeader from "./header";

const IssueListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <IssueListHeader />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
};
export default IssueListLayout;

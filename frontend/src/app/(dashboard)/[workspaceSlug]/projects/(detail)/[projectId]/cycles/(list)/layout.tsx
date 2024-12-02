import { ContentWrapper } from "@/components/content-wrapper";
import CycleListHeader from "./header";

const ListCycleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CycleListHeader />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
};
export default ListCycleLayout;

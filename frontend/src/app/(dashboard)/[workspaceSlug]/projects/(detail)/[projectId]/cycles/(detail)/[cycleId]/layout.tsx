import { ContentWrapper } from "@/components/content-wrapper";
import { CycleLayoutHeader } from "./header";

const CycleDetailsLayout = ({children}: {
    children: React.ReactNode;
}) => {
  return (
    <>
      <CycleLayoutHeader />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
};
export default CycleDetailsLayout;

import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const DefaultLayout: FC<Props> = ({ children }) => (
  <div className={`h-screen w-full overflow-hidden`}>{children}</div>
);

export default DefaultLayout;

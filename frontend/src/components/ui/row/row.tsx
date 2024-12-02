import * as React from "react";

import { ERowVariant, rowStyle, TRowVariant } from "./helper";
import { cn } from "@/lib/utils";

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TRowVariant;
  className?: string;
  children: React.ReactNode;
}

const Row = React.forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const { variant = ERowVariant.REGULAR, className = "", children, ...rest } = props;

  const style = rowStyle[variant];

  return (
    <div ref={ref} className={cn(style, className)} {...rest}>
      {children}
    </div>
  );
});

Row.displayName = "plane-ui-row";

export { Row, ERowVariant };

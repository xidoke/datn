import { ISSUE_LAYOUTS, IssueLayoutTypes } from "@/helpers/constants/issue";

type Props = {
  layouts: IssueLayoutTypes[];
  onChange: (layout: IssueLayoutTypes) => void;
  selectedLayout: IssueLayoutTypes | undefined;
};

export const LayoutSelection = (props: Props) => {
  const { layouts, onChange, selectedLayout } = props;

  const handleOnChange = (layoutKey: IssueLayoutTypes) => {
    if (selectedLayout !== layoutKey) {
      onChange(layoutKey);
    }
  };
  return (
    <div className="flex items-center gap-1 rounded p-1">
      {ISSUE_LAYOUTS.filter((l) => layouts.includes(l.key)).map((layout) => (
        <button
          key={layout.key}
          type="button"
          className={`hover:bg-custom-background-100 group grid h-[22px] w-7 place-items-center overflow-hidden rounded transition-all ${
            selectedLayout == layout.key
              ? "bg-custom-background-100 shadow-custom-shadow-2xs"
              : ""
          }`}
          onClick={() => handleOnChange(layout.key)}
        >
          <layout.icon
            size={14}
            strokeWidth={2}
            className={`h-3.5 w-3.5 ${
              selectedLayout == layout.key
                ? "text-custom-text-100"
                : "text-custom-text-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// loading.tsx

import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div
      className="relative flex h-screen w-full items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner />
    </div>
  );
}
export default Loading

// loading.tsx

import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Spinner className="w-12 h-12" />
    </div>
  )
}
export default Loading

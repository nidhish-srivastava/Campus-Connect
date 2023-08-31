import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex min-h-full gap-5 items-center justify-center mt-10">
      <Skeleton className="h-12 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-[500px]" />
        <Skeleton className="h-8 w-[400px]" />
      </div>
    </div>
    )
  }
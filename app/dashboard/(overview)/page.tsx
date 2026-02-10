import CardWrapper from "@/app/ui/dashboard/cards";
import { Suspense } from 'react';
import { CardsSkeleton } from "@/app/ui/skeletons";

export default function Page() {
  return (
    <>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={ <CardsSkeleton />}>
        <CardWrapper />
      </Suspense>
    </div>
    </>
  )
}
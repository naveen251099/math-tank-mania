
import { Suspense } from "react";
import MathTankMania from "@/components/games/MathTankMania";
import { Skeleton } from "@/components/ui/skeleton";

const GamePage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Math Tank Mania</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full max-w-3xl mx-auto rounded-xl" />}>
        <MathTankMania />
      </Suspense>
    </div>
  );
};

export default GamePage;

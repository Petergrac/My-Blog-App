import Unauthorized from "@/components/UnauthorizedContent";
import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";

const UnauthorizedPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="w-full h-[70vh] flex items-center justify-center">
            <LoaderIcon className="animate-spin" size={49} />
          </div>
        }
      >
        <Unauthorized />
      </Suspense>
    </div>
  );
};

export default UnauthorizedPage;

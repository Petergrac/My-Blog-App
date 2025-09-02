import Link from "next/link";
const CagegoryLinks = () => {
  return (
    <div className="flex flex-wrap gap-2 gap-y-5 pt-1 justify-center border-b-[1px] pb-3 md:pb-5">
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/frontend"
      >
        FRONTEND
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/backend"
      >
        BACKEND
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/devops"
      >
        DEVOPS
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/data-structures"
      >
        DATA STRUCTURES
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/data-science"
      >
        DATA SCIENCE
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/testing"
      >
        TESTING
      </Link>
      <Link
        className="text-xs font-lora p-2 hover:bg-foreground/55"
        href="/categories/system-design"
      >
        SYSTEM DESIGN
      </Link>
    </div>
  );
};

export default CagegoryLinks;

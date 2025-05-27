import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleX, Search } from "lucide-react";
import { useId } from "react";

function SearchBar() {
  const id = useId();
  return (
    <div className="space-y-2 min-w-[300px] p-5 rounded-r-lg">
      <h1 className=" text-2xl font-bold pb-15 ">Search</h1>
      <div className="relative">
        <Input id={id} className="peer pe-9 ps-9" placeholder="Search..." type="search" />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <CircleX size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      <hr className="border-t border-gray-300 my-6" />
    </div>
    
  );
}

export { SearchBar };

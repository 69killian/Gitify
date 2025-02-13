import { Search } from "lucide-react";

export function CommandDemo() {
  return (
    <div className="relative rounded-lg shadow-md xl:w-[681.16px] ">
      <input
        type="text"
        className="w-full min-w-0 py-2 h-[40px] pl-10 pr-4 bg-[#160E1E] text-white text-sm rounded-md border border-[#1d1d1d] placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
        placeholder="Rechercher un Badge, un Challenger..."
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 md:w-6" />
    </div>
  );
}

import React, { useState, ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const clearSearch = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-[var(--textMinimal)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Rechercher des comptes, hashtags, lieux..."
        className="pl-10 pr-10 py-2.5 w-full rounded-lg text-sm bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] focus:outline-none focus:ring-1 focus:ring-[var(--blue)] text-[var(--textNeutral)] placeholder:text-[var(--textMinimal)]"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <X className="h-4 w-4 text-[var(--textMinimal)]" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;

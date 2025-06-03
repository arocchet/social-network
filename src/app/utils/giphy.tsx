/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { MdGif, MdOutlineGifBox } from "react-icons/md";
import { Button } from "@/components/ui/button";

type GifPopoverProps = {
  onSelect: (gif: IGif) => void;
  apiKey: string;
};

export const GifPopover: React.FC<GifPopoverProps> = ({ onSelect, apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IGif[]>([]);
  const [loading, setLoading] = useState(false);

  const gf = new GiphyFetch(apiKey);

  const searchGifs = async (q: string) => {
    setLoading(true);
    const { data } = await gf.search(q, { limit: 9 });
    setResults(data);
    setLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) searchGifs(val);
    else setResults([]);
  };

  return (
    <div className="relative  ">
      <Button
        variant="ghost"
        className="border-1 border-[var(--detailMinimal)] p-2 flex items-center justify-center"
         onClick={() => setIsOpen(!isOpen)}
      >
        GIF
      </Button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 z-[9999] w-80 bg-white border shadow-lg rounded-lg p-4">
          <input
            type="text"
            placeholder="Search GIFs"
            value={query}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md mb-2"
          />
          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {results.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_width_small.url}
                  alt={gif.title}
                  className="cursor-pointer rounded-md hover:opacity-75"
                  onClick={() => {
                    onSelect(gif);
                    setIsOpen(false);
                    setQuery("");
                    setResults([]);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

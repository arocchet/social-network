"use client";

/* eslint-disable @next/next/no-img-element */
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";

const GIPHY_API = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

type GifPopoverProps = {
  onSelect: (gif: IGif) => void;
  apiKey: string;
};

export const GifPopover: React.FC<GifPopoverProps> = ({ onSelect, apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const gf = new GiphyFetch(apiKey || GIPHY_API!);

  const searchGifs = async (q: string) => {
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await gf.search(q, { limit: 300 });
      setResults(data);
    } catch (err) {
      console.error("Erreur lors de la recherche de GIFs:", err);
      setError("Erreur lors de la recherche de GIFs");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 2) {
      searchGifs(val);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        className="border-1 border-[var(--detailMinimal)] p-2 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        GIF
      </Button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 z-[99999] w-80 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] shadow-lg rounded-lg p-4">
          {/* En-tête avec toggle theme */}
          <div className="flex items-center justify-end mb-3"></div>

          <input
            type="text"
            placeholder="Rechercher des GIFs (min 3 caractères)"
            value={query}
            onChange={handleSearchChange}
            className="w-full p-2 border border-[var(--detailMinimal)] bg-[var(--bgLevel2)] text-[var(--textNeutral)] rounded-md mb-2"
            onClick={(e) => e.stopPropagation()}
          />

          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--blueFill)]"></div>
              <p className="mt-2 text-sm text-[var(--textNeutral)]">
                Chargement...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {results.length === 0 && query.length > 2 && !loading && (
                <div className="col-span-3 text-center py-4 text-[var(--textMinimal)]">
                  Aucun GIF trouvé
                </div>
              )}
              {results.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_width_small.url || "/placeholder.svg"}
                  alt={gif.title}
                  className="cursor-pointer rounded-md hover:opacity-75 w-full h-20 object-cover"
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

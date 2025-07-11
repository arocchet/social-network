"use client";
import React, { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory } from "@/lib/utils/searchHistory";

interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

interface RecentSearchesProps {
  onSearchClick: (query: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ onSearchClick }) => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const searches = getSearchHistory();
    setRecentSearches(searches.slice(0, 10)); // Limit to 10 recent searches
  };

  const removeSearch = (searchId: string) => {
    removeFromSearchHistory(searchId);
    loadRecentSearches(); // Reload to update the UI
  };

  const clearAllSearches = () => {
    clearSearchHistory();
    setRecentSearches([]);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  if (recentSearches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--textMinimal)]">
          Aucune recherche récente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm text-[var(--textNeutral)]">
          Récent
        </h2>
        <button
          onClick={clearAllSearches}
          className="text-xs text-[var(--textMinimal)] hover:text-[var(--textNeutral)] transition-colors"
        >
          Tout effacer
        </button>
      </div>
      
      <div className="space-y-2">
        {recentSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors group"
          >
            <button
              onClick={() => onSearchClick(search.query)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bgLevel2)] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[var(--textMinimal)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[var(--textNeutral)] truncate">
                  {search.query}
                </p>
                <p className="text-xs text-[var(--textMinimal)]">
                  {formatTimeAgo(search.timestamp)}
                </p>
              </div>
            </button>
            <button
              onClick={() => removeSearch(search.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--bgLevel3)] rounded"
            >
              <X className="w-4 h-4 text-[var(--textMinimal)]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
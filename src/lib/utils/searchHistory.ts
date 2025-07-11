export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export const addToSearchHistory = (query: string): void => {
  if (!query.trim()) return;

  try {
    const existing = getSearchHistory();
    const trimmedQuery = query.trim();
    
    // Remove duplicate if exists
    const filtered = existing.filter(item => item.query !== trimmedQuery);
    
    // Add new search at the beginning
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: trimmedQuery,
      timestamp: Date.now(),
    };
    
    const updated = [newSearch, ...filtered].slice(0, 10); // Keep only 10 recent searches
    
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  } catch (error) {
    console.error("Error adding to search history:", error);
  }
};

export const getSearchHistory = (): RecentSearch[] => {
  try {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error getting search history:", error);
  }
  return [];
};

export const removeFromSearchHistory = (searchId: string): void => {
  try {
    const existing = getSearchHistory();
    const updated = existing.filter(item => item.id !== searchId);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing from search history:", error);
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem("recentSearches");
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};
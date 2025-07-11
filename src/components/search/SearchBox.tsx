"use client";
import React, { useState, useEffect } from "react";
import ResultsList, { AccountItem, TagItem, PostItem } from "./Result";
import { addToSearchHistory } from "@/lib/utils/searchHistory";


type SearchItem = AccountItem | TagItem | PostItem;

interface SearchBoxProps {
    query: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ query }) => {
    const [results, setResults] = useState<SearchItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/private/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
                // Only add to history when we actually fetch results (after debounce)
                addToSearchHistory(query);
            } catch (err) {
                console.error("Erreur API:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchResults, 300);
        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="text-sm text-[var(--textMinimal)] text-center">Chargement…</div>
            ) : (
                <ResultsList query={query} results={results} />
            )}
        </div>
    );
};

export default SearchBox;

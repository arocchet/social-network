"use client";

import { useState } from "react";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import SearchBox from "@/components/search/SearchBox";
import { SearchBar } from "@/components/search/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/toggle-theme";
import RecentSearches from "@/components/search/RecentSearches";
import { addToSearchHistory } from "@/lib/utils/searchHistory";

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Handler for search input changes
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Handler for clicking on recent search
    const handleRecentSearchClick = (query: string) => {
        setSearchQuery(query);
        addToSearchHistory(query);
    };

    return (
        <div className="flex h-screen bg-[var(--bgLevel2)]">
            <NavigationBar />

            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header with improved layout */}
                <header className="sticky top-0 z-10 bg-[var(--bgLevel1)] pb-0">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 flex-1">

                            <h1 className="text-xl font-semibold text-[var(--textNeutral)] whitespace-nowrap">
                                Rechercher
                            </h1>

                            {/* Search bar placed directly next to the title */}
                            <div className="ml-3 flex-1 max-w-md">
                                <SearchBar onSearch={handleSearchChange} />
                            </div>
                        </div>

                        {/* ModeToggle at the far right */}
                        <div className="">
                            <ModeToggle />
                        </div>
                    </div>

                    <div className="border-b border-[var(--detailMinimal)]"></div>
                </header>

                {/* Search content */}
                <div className="flex-1 overflow-y-auto">
                    {searchQuery ? (
                        <div className="p-4">
                            <SearchBox query={searchQuery} />
                            {/* Search Results categorized by tabs */}
                            {/* <Tabs
                                defaultValue="all"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-4 bg-[var(--bgLevel2)] mb-4 gap-2 w-full" >
                                    <TabsTrigger value="all" className="border-r border-[var(--detailMinimal)]">
                                        Tout
                                    </TabsTrigger>
                                    <TabsTrigger value="accounts" className="border-r border-[var(--detailMinimal)]">
                                        Comptes
                                    </TabsTrigger>
                                    <TabsTrigger value="tags" className="border-r border-[var(--detailMinimal)]">
                                        Hashtags
                                    </TabsTrigger>
                                    <TabsTrigger value="places" className="border-r border-[var(--detailMinimal)]">
                                        Lieux
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="mt-0">
                                    <SearchBox query={searchQuery} />
                                </TabsContent>

                                <TabsContent value="accounts" className="mt-0">
                                    <SearchBox query={searchQuery} />
                                </TabsContent>

                                <TabsContent value="tags" className="mt-0">
                                    <SearchBox query={searchQuery} />
                                </TabsContent>

                                <TabsContent value="places" className="mt-0">
                                    <SearchBox query={searchQuery} />
                                </TabsContent>
                            </Tabs> */}
                        </div>
                    ) : (
                        <div className="p-4">
                            {/* Recent/Suggested searches shown when no query */}
                            <RecentSearches onSearchClick={handleRecentSearchClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

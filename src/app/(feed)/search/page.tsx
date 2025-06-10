"use client";

import { useState } from "react";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import FakeResultsList from "@/components/search/Result";
import { SearchBar } from "@/components/search/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/toggle-theme";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Handler for search input changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex h-screen bg-[var(--bgLevel2)]">
      <NavigationBar />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header with improved layout */}
        <header className="sticky top-0 z-10 bg-[var(--bgLevel1)] pb-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br  from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[var(--textNeutral)] whitespace-nowrap">
                Rechercher
              </h1>

              {/* Search bar placed directly next to the title */}
              <div className="ml-3 flex-1 max-w-md">
                <SearchBar onSearch={handleSearchChange} />
              </div>
            </div>

            {/* ModeToggle at the far right */}
            <div className="ml-3">
              <ModeToggle />
            </div>
          </div>

          <div className="border-b border-[var(--detailMinimal)]"></div>
        </header>

        {/* Search content */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            <div className="p-4">
              {/* Search Results categorized by tabs */}
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-4 bg-[var(--bgLevel2)] mb-4">
                  <TabsTrigger value="all">Tout</TabsTrigger>
                  <TabsTrigger value="accounts">Comptes</TabsTrigger>
                  <TabsTrigger value="tags">Hashtags</TabsTrigger>
                  <TabsTrigger value="places">Lieux</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <FakeResultsList query={searchQuery} />
                </TabsContent>

                <TabsContent value="accounts" className="mt-0">
                  <FakeResultsList query={searchQuery} type="accounts" />
                </TabsContent>

                <TabsContent value="tags" className="mt-0">
                  <FakeResultsList query={searchQuery} type="tags" />
                </TabsContent>

                <TabsContent value="places" className="mt-0">
                  <FakeResultsList query={searchQuery} type="places" />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="p-4">
              {/* Recent/Suggested searches shown when no query */}
              <h2 className="font-medium text-sm mb-4 text-[var(--textNeutral)]">
                Récent
              </h2>

              <div className="space-y-2">
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--textMinimal)]">
                    Aucune recherche récente
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

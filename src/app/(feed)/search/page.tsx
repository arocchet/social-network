'use client'

import NavigationBar from "@/components/feed/navBar/navigationBar"
import FakeResultsList from "@/components/search/Result"
import { SearchBar } from "@/components/search/SearchBar"

export default function searchPage(){
    return(
    <div className="flex h-screen bg-[var(--bgLevel1)]">
        <NavigationBar/>

        <div className="flex-1 flex flex-col overflow-hidden">
            <SearchBar />
            <FakeResultsList />
        </div>
    </div>
    )
}
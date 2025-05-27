'use client'

import FakeResultsList from "@/components/search/Result"
import { SearchBar } from "@/components/search/SearchBar"

export default function searchPage(){
    return(
    <div className="grid grid-cols-[200px_600px] border-2 h-screen">
        {/* Colonne Button */}
        <div className="flex items-center justify-center p-4
                        border-r-2 border-dashed border--300">
            Button
        </div>
        <div className="border-2 border-gray rounded-r-lg rounded-br-lg">
            <SearchBar />
            <FakeResultsList />
        </div>
        
    </div>
    )
}
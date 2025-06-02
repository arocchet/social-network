'use client'

import Settings from "@/components/settings/SettingsMain";

export default function settingsPage(){
  return(
    <div className="h-screen bg-[var(--bgLevel1)] flex flex-col md:w-fit">
       <Settings />
    </div>
  );
}
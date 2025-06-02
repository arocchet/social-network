// src/app/(feed)/edit-profile/page.tsx

'use client';

import EditProfile from "@/components/settings/Profile";

export default function EditProfilPage() {
  return (
    <div className="flex justify-center items-start w-full min-h-screen bg-[var(--bgLevel3)]">
      <EditProfile />
    </div>
  );
}
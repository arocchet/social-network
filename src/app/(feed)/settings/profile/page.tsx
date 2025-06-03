// src/app/(feed)/edit-profile/page.tsx

'use client';

import EditProfile from "@/components/settings/Profile";

export default function EditProfilPage() {
  return (
    <div className="flex justify-center items-center w-full  bg-[var(--bgLevel2)]">
      <EditProfile />
    </div>
  );
}
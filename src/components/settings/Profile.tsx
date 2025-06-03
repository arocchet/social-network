// pages/edit-profile.tsx
'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

type GenderOption = "male" | "female" | "prefer_not_to_say";

interface Profile {
  username: string;
  displayName: string;
  avatarUrl: string;
  website: string;
  bio: string;
  gender: GenderOption;
  showAccountSuggestions: boolean;
}

const EditProfile = () => {
  // Valeurs initiales (par défaut, on pourrait en charger dynamiquement via getServerSideProps ou API)
  const [profile, setProfile] = useState<Profile>({
    username: "zanakan12maniac",
    displayName: "Rafta Zanakan Douze Màniac",
    avatarUrl:
      "https://images.pexels.com/photos/20220477/pexels-photo-20220477/free-photo-of-gros-plan-d-un-beau-mannequin-heureux.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    website: "https://monblog.exemple.com",
    bio: "Photographe amateur 📸 • Passionné de voyages ✈️ • Partage mes aventures ici !",
    gender: "prefer_not_to_say",
    showAccountSuggestions: false,
  });

  // Gère le changement des champs de texte (displayName, website, bio)
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gère le changement du champ Gender (select)
  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as GenderOption;
    setProfile((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  // Gère l’interrupteur ShowAccountSuggestions
  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setProfile((prev) => ({
      ...prev,
      showAccountSuggestions: checked,
    }));
  };

  // Gère le changement de la photo de profil (placeholder ici)
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: objectUrl,
      }));
    }
  };

  // Soumission du formulaire (placeholder)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Appel API (ex. fetch("/api/profile", { method: "POST", body: JSON.stringify(profile) }))
    console.log("Envoi des données de profil :", profile);
    alert("Profil mis à jour !"); //(mettre un truc plus stylé)
  };

  return (
    <div className="min-h-screen bg-[var(--bgLevel2)] text-white p-6 md:px-20 lg:px-40">
      <h1 className="text-3xl font-semibold mb-8">Edit profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Bloc photo + username + displayName --- */}
        <div className="flex items-center space-x-6 bg-[var(--bgLevel3)] rounded-xl px-6 py-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2">
            {/* Photo de profil */}
            <Image
              src={profile.avatarUrl}
              alt="Avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="flex-1">
            <p className="font-medium text-lg">{profile.username}</p>
            <p className="text-gray-400">{profile.displayName}</p>
          </div>

          {/* Button « Change photo » */}
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer bg-[var(--pink20)] hover:bg-pink-300 transition px-4 py-2 rounded text-sm font-medium"
          >
            Change photo
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* --- Website (note : modifiable uniquement sur mobile dans certaines applis) --- */}
        <div className="space-y-2">
          <label htmlFor="website" className="block font-medium">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={profile.website}
            onChange={handleInputChange}
            placeholder="Website"
            className="w-full bg-[var(--bgLevel3)] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            Editing your links is only available on mobile. Visit the Konekt
            app and edit your profile to change the websites in your bio.
          </p>
        </div>

        {/* --- Bio (max 150 caractères) --- */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block font-medium">
            Bio
          </label>
          <div className="relative">
            <textarea
              id="bio"
              name="bio"
              maxLength={150}
              rows={3}
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full bg-[var(--bgLevel3)] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <span className="absolute bottom-2 right-4 text-gray-400 text-sm">
              {profile.bio.length} / 150
            </span>
          </div>
        </div>

        {/* --- Gender --- */}
        <div className="space-y-2">
          <label htmlFor="gender" className="block font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleGenderChange}
            className="w-full bg-[var(--bgLevel3)] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          <p className="text-sm text-gray-500">
            This won’t be part of your public profile.
          </p>
        </div>

        {/* --- Show account suggestions on profiles (toggle) --- */}
        <div className="space-y-2">
          <label className="block font-medium">
            Show account suggestions on profiles
          </label>
          <div className="flex items-center justify-between bg-[var(--bgLevel3)] rounded-xl px-4 py-3">
            <div>
              <p className="font-medium">
                Show account suggestions on profiles
              </p>
              <p className="text-sm text-gray-400">
                Choose whether people can see similar account suggestions on
                your profile, and whether your account can be suggested on
                other profiles.
              </p>
            </div>
            <label htmlFor="toggle-suggestions" className="cursor-pointer">
              <input
                type="checkbox"
                id="toggle-suggestions"
                checked={profile.showAccountSuggestions}
                onChange={handleToggleChange}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 flex items-center bg-gray-600 rounded-full p-1 duration-200 ease-in-out ${
                  profile.showAccountSuggestions ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transform duration-200 ease-in-out ${
                    profile.showAccountSuggestions ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* --- Bouton de soumission --- */}
        <div>
          <button
            type="submit"
            className="w-30 bg-[var(--pink20)] hover:bg-pink-300 transition px-4 py-2 rounded-xl font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

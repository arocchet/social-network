/* eslint-disable @next/next/no-img-element */
'use client';
import { useUserForm } from "@/app/context/user-register-form-context";
import { formatDate } from "@/app/utils/dateFormat";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { FaImage } from "react-icons/fa6";
import { FaBirthdayCake } from "react-icons/fa";
import { useIsMounted } from "@/hooks/use-is-mounted";

const ProfilDemoRender = () => {
  const { userInfo } = useUserForm();

  const currentAvatarImage = userInfo.avatar?.previewUrl || "";
  const currentCoverImage = userInfo.cover?.previewUrl || "";

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="overflow-hidden bg-[var(--bgLevel2)] border-[var(--detailMinimal)] border-l-1">
      <div className="flex rounded-none">
        <Input
          readOnly
          className="z-10 -ms-px rounded-none border-none shadow-none "
          placeholder={`https://konekt/profil/${userInfo.username}.fr`}
          onChange={(e) => { }}
          type="text"
        />
      </div>
      <div className="relative">
        {currentCoverImage ? (
          <img
            src={currentCoverImage}
            alt="Cover"
            className="w-full bg-[var(--bgLevel2)] h-40 object-cover border-y-1 border-[var(--detailMinimal)]"
          />
        ) : (
          <div className="w-full bg-[var(--bgLevel2)] h-40 justify-center flex items-center border-y-1 border-[var(--detailMinimal)]">
            <FaImage className="text-neutral-300" size={60} />
          </div>
        )}

        <div className="absolute -bottom-10 left-6">
          {currentAvatarImage ? (
            <img
              src={currentAvatarImage}
              alt="Avatar"
              className="w-20 h-20 object-cover rounded-full border-4 border-[var(--detailMinimal)] shadow-md bg-[var(--bgLevel2)]"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--bgLevel2)] border-4 border-[var(--detailMinimal)]shadow-md">
              <FaImage className="text-neutral-300" size={40} />
            </div>
          )}
        </div>
      </div>

      <div className="h-12 bg-[var(--bgLevel1)]" />
      <div className="px-6 pb-6 pt-2 bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-b-1 ">
        <form className="space-y-4">
          <div className="text-blue-500 text-sm font-semibold flex gap-2 items-center">
            <FaBirthdayCake />

            {userInfo.dateOfBirth ? formatDate(userInfo.dateOfBirth) : ""}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row ">
            <div className="flex-1 space-y-2">
              <Label>Prénom</Label>
              <Input
                placeholder="Matt"
                type="text"
                required
                readOnly
                value={userInfo.firstname}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Nom</Label>
              <Input
                placeholder="Welsh"
                type="text"
                required
                readOnly
                value={userInfo.lastname}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                value={userInfo.username}
                className="peer pe-9"
                placeholder="Username"
                type="text"
                required
                readOnly
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground/80">
                <Check size={16} strokeWidth={2} className="text-emerald-500" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Biographie</Label>
            <Textarea
              placeholder="Write a few sentences about yourself"
              value={userInfo.biography}
              readOnly
            />
          </div>
        </form>
      </div>
      <Card className="shadow-none border-none rounded-none bg-[var(--bgLevel2)]">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
              <Skeleton className="h-4 w-[200px] bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
            </div>
          </div>
          <Skeleton className="h-4 w-4/5 bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
          <Skeleton className="h-4 w-2/3 bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-lg bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
        </CardContent>
        <CardFooter className="gap-2">
          <Skeleton className="h-8 w-20 bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
          <Skeleton className="h-8 w-20 bg-[var(--bgLevel1)] border-[var(--detailMinimal)] border-1" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilDemoRender;

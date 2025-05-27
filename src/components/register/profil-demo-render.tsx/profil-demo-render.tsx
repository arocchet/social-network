/* eslint-disable @next/next/no-img-element */
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
  const { imageData, username, biography, dateOfBirth, firstname, lasttname } =
    useUserForm();
  const avatar = imageData.avatar;
  const cover = imageData.cover;
  const currentAvatarImage = avatar.previewUrl || "";
  const currentCoverImage = cover.previewUrl || "";

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="overflow-hidden ">
      <div className="flex  rounded-none">
        <Input
          readOnly
          className="z-10 -ms-px rounded-none border-none shadow-none"
          placeholder={`https://konekt/profil/${username}.fr`}
          onChange={(e) => {}}
          type="text"
        />
      </div>
      <div className="relative">
        {currentCoverImage ? (
          <img
            src={currentCoverImage}
            alt="Cover"
            className="w-full bg-muted h-40 object-cover"
          />
        ) : (
          <div className="w-full bg-muted h-40 justify-center flex items-center">
            <FaImage className="text-neutral-300" size={60} />
          </div>
        )}

        <div className="absolute -bottom-10 left-6">
          {currentAvatarImage ? (
            <img
              src={currentAvatarImage}
              alt="Avatar"
              className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md bg-muted"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted border-4 border-white shadow-md">
              <FaImage className="text-neutral-300" size={40} />
            </div>
          )}
        </div>
      </div>

      <div className="h-12" />
      <div className="px-6 pb-6 pt-2">
        <form className="space-y-4">
          <div className="text-blue-500 text-sm font-semibold flex gap-2 items-center">
            <FaBirthdayCake />

            {dateOfBirth ? formatDate(dateOfBirth) : ""}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label>Prénom</Label>
              <Input
                placeholder="Matt"
                type="text"
                required
                readOnly
                value={firstname}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Nom</Label>
              <Input
                placeholder="Welsh"
                type="text"
                required
                readOnly
                value={lasttname}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                value={username}
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
              value={biography}
              readOnly
            />
          </div>
        </form>
      </div>
      <Card className="shadow-none border-none rounded-none ">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded" />
        </CardContent>
        <CardFooter className="gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilDemoRender;

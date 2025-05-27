import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "../../../config/site";
import { DateOfBirth } from "./date-of-birth";
import { Avatar } from "./avatar-upload";
import { ProfileBg } from "./banner-upload";
import { Textarea } from "../ui/textarea";
import { useUserForm } from "@/app/context/user-register-form-context";
import Link from "next/link";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    username,
    setUsername,
    lasttname,
    setBiography,
    biography,
    setFirstname,
    setLasttname,
    firstname,
  } = useUserForm();

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Rejoindre {siteConfig.name}</h1>
      </div>
      <div className="grid gap-6 ">
        <div className="grid gap-2 justify-center ">
          <Avatar />
        </div>
        <div className="grid gap-2 w-full">
          <ProfileBg />
        </div>
        <div className="flex gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstname">Prénom</Label>
            <Input
              id="firstname"
              placeholder="dupont"
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">Nom</Label>
            <Input
              id="lastname"
              placeholder="Martin"
              required
              value={lasttname}
              onChange={(e) => setLasttname(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lastname">Username</Label>
            <Input
              id="lastname"
              placeholder="Martin"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <DateOfBirth />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="biographie">Biographie</Label>
          <Textarea
            id="biographie"
            placeholder="Dev full stack ..."
            required
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="**********"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Créer un compte
        </Button>
      </div>
      <div className="text-center text-sm">
        Vous avez un compte sur {siteConfig.name} ?{" "}
        <Link href="/login" className="underline underline-offset-4">
          connectez-vous
        </Link>
      </div>
    </form>
  );
}

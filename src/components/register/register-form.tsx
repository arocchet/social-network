"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "../../../config/site";
import { format } from "date-fns";
import { Avatar } from "./avatar-upload";
import { ProfileBg } from "./banner-upload";
import { useUserForm } from "@/app/context/user-register-form-context";
import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { FaBirthdayCake } from "react-icons/fa";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { handleChange, handleSubmit, userInfo, errors } = useUserForm();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Rejoindre {siteConfig.name}</h1>
      </div>

      <div className="grid gap-6 border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)] p-6 rounded-xl">
        <div className="grid gap-2 justify-center">
          <Avatar />
        </div>

        <div className="grid gap-2 w-full">
          <ProfileBg />
        </div>

        <div className="flex gap-4">
          <div className="grid gap-2 w-full">
            <Label htmlFor="firstname" className="font-medium">
              First Name
              <span className="text-red-500 text-xl" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (champ obligatoire)</span>
            </Label>

            <Input
              id="firstname"
              name="firstname"
              placeholder="dupont"
              required
              value={userInfo.firstname}
              onChange={handleChange}
              className="border-[var(--detailMinimal)]"
            />

            <div className="min-h-[1.25rem]">
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2 w-full">
            <Label htmlFor="lastname" className="font-medium">
              Last Name
              <span className="text-red-500 text-xl" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (champ obligatoire)</span>
            </Label>
            <Input
              id="lastname"
              name="lastname"
              placeholder="Martin"
              required
              value={userInfo.lastname}
              className="border-[var(--detailMinimal)]"
              onChange={handleChange}
            />
            <div className="min-h-[1.25rem]">
              {errors.lastname && (
                <p className="text-red-500 text-sm">{errors.lastname}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Username */}
          <div className="grid gap-2 w-full">
            <Label htmlFor="username" className="font-medium">
              Username
              <span className="text-red-500 text-xl" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (champ obligatoire)</span>
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="martin123"
              required
              value={userInfo.username}
              className="border-[var(--detailMinimal)]"
              onChange={handleChange}
            />
            <div className="min-h-[1.25rem]">
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
          </div>

          {/* Date of birth */}
          <div className="grid gap-2 w-full">
            <Label htmlFor="dateOfBirth" className="font-medium">
              Date de naissance
              <span className="text-red-500 text-xl" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (champ obligatoire)</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="pl-3 text-left font-normal border border-[var(--detailMinimal)] w-full"
                >
                  {userInfo.dateOfBirth ? (
                    format(new Date(userInfo.dateOfBirth), "PPP")
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                  <FaBirthdayCake className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout={dropdown}
                  selected={
                    userInfo.dateOfBirth
                      ? new Date(userInfo.dateOfBirth)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      const formatted = format(date, "yyyy-MM-dd");
                      handleChange({
                        target: {
                          id: "dateOfBirth",
                          value: formatted,
                        },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="min-h-[1.25rem]">
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="biography" className="font-medium">
            Biography
          </Label>
          <Textarea
            id="biography"
            name="biography"
            placeholder="Dev full stack ..."
            required
            value={userInfo.biography}
            className="border-[var(--detailMinimal)] resize-none"
            onChange={handleChange}
          />
          <div className="min-h-[1.25rem]">
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.biography}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium">
            Email
            <span className="text-red-500 text-xl" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (champ obligatoire)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={userInfo.email}
            className="border-[var(--detailMinimal)]"
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="font-medium">
            Password
            <span className="text-red-500 text-xl" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (champ obligatoire)</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              placeholder="**********"
              required
              value={userInfo.password}
              className="border-[var(--detailMinimal)] w-full pr-10"
              onChange={handleChange}
            />
            <button
              type="button"
              onMouseDown={() => setIsVisible(true)}
              onMouseUp={() => setIsVisible(false)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--pink20)] text-[var(--white)] hover:bg-[var(--pink40)]"
          onClick={handleSubmit}
        >
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
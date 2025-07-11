'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "../../../config/site";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/client/user/login";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { OAuthLoginButton } from "../auth/OAuthLoginButton";
import { CredentialsLogin, UserSchemas } from "@/lib/schemas/user";

type LoginFormErrors = Partial<CredentialsLogin> & {
  general?: string;
};

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [credentials, setCredentials] = useState<CredentialsLogin>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormErrors>>({});
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoanding] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = UserSchemas.Auth.CredentialsLogin.safeParse(credentials);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setIsLoanding(true)
    try {
      setErrors({});
      const response = await login(credentials);
      if (response.success) router.push('/')
    } catch (err) {
      if (err && typeof err === "object" && !Array.isArray(err)) {
        setErrors((prev) => ({ ...prev, ...err }));
      } else if (err instanceof Error) {
        console.error("Unexpected error :", err.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [id]: value.trim(),
    }));
  };

  return (
    <div className="flex flex-col flex-1 mt-25 justify-center px-16">
      <h1 className="flex items-center justify-center text-3xl text-center font-bold p-15 text-[var(--textNeutral)] ">
        Bon retour sur {siteConfig.name.toLocaleUpperCase()}
      </h1>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="shadow-none text-center border border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--textNeutral)]">Se connecter</CardTitle>
            <OAuthLoginButton />
            <CardDescription>
              Entrez vos informations pour continuer sur {siteConfig.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-[var(--textNeutral)]" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="border-[var(--detailMinimal)]"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="**********"
                    required
                    value={credentials.password}
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
                <div className="min-h-[1.25rem]">
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full bg-[var(--pink20)] text-[var(--white)] hover:bg-[var(--pink40)]" onClick={handleSubmit}>
                  {isLoading ? (<div className="flex items-center gap-2">Connection en cours <Loader className="animate-spin" /></div>) : ("Se connecter")}
                </Button>
                <div className="min-h-[1.25rem]">
                  {errors.general && (
                    <p className="text-red-500 text-sm">{errors.general}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Vous n&apos;avez pas de compte?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Créer un compte
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

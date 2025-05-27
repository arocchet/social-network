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
import { ModeToggle } from "../toggle-theme";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="shadow-none text-center border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--textNeutral)]">Se connecter</CardTitle>
          <CardDescription>
            Entrez vos informations pour continuer sur {siteConfig.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="text-[var(--textNeutral)]" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="border-[var(--detailMinimal)]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-[var(--textNeutral)]" htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input id="password" type="password" required className="border-[var(--detailMinimal)]"
                />
              </div>
            <Button type="submit" className="w-full bg-[var(--pink20)] text-[var(--white)] hover:bg-[var(--pink40)]">
                Se connecter
              </Button>
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
  );
}

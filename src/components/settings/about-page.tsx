"use client"

import { ArrowLeft, ExternalLink, Shield, FileText, Info, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

interface AboutPageProps {
  onBack?: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg">À propos</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Informations de l'application */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="flex items-center gap-3 mb-4 ">
            <Avatar className="w-12 h-12 rounded-full">
              <AvatarImage src={"/favicon.png"} alt="Logo" />
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-[var(--textMinimal)]">Konekt</h2>
              <p className="text-sm text-[var(--textNeutral)]">Version 1.2.3</p>
            </div>
          </div>
          <p className="text-sm text-[var(--textNeutral)] leading-relaxed">
            Partagez vos moments précieux avec vos proches. Une application moderne pour capturer et partager la beauté du quotidien.
          </p>
        </div>

        {/* Liens légaux */}
        <div className="space-y-3">
          <h3 className="font-medium text-[var(--textMinimal)] px-2">Informations légales</h3>

          <Link href="/legal/terms" className="block">
            <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--textNeutral)]" />
                <span className="text-[var(--textMinimal)]">Conditions d'utilisation</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--textNeutral)]" />
            </div>
          </Link>

          <Link href="/legal/privacy" className="block">
            <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[var(--textNeutral)]" />
                <span className="text-[var(--textMinimal)]">Politique de confidentialité</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--textNeutral)]" />
            </div>
          </Link>

          <Link href="/legal/cookies" className="block">
            <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--textNeutral)]" />
                <span className="text-[var(--textMinimal)]">Politique des cookies</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--textNeutral)]" />
            </div>
          </Link>
        </div>

        {/* Support et contact */}
        <div className="space-y-3">
          <h3 className="font-medium text-[var(--textMinimal)] px-2">Support</h3>

          {/* <Link href="/support/help" className="block">
            <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] transition-colors">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-[var(--textNeutral)]" />
                <span className="text-[var(--textMinimal)]">Centre d'aide</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--textNeutral)]" />
            </div>
          </Link> */}

          <Link href="mailto:support@photoshare.app" className="block">
            <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--textNeutral)]" />
                <div>
                  <span className="text-[var(--textMinimal)] block">Nous contacter</span>
                  <span className="text-sm text-[var(--textNeutral)]">support@konekt.app</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--textNeutral)]" />
            </div>
          </Link>
        </div>

        {/* Informations techniques */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <h3 className="font-medium text-[var(--textMinimal)] mb-3">Informations techniques</h3>
          <div className="space-y-2 text-sm text-[var(--textNeutral)]">
            <div className="flex justify-between">
              <span>Version de l'application</span>
              <span>1.2.3</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2025.06.09</span>
            </div>
            <div className="flex justify-between">
              <span>Plateforme</span>
              <span>Web</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center p-4">
          <p className="text-sm text-[var(--textNeutral)]">
            © 2025 Konekt. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}
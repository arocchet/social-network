// src/app/(feed)/settings/page.tsx
'use client'

import {
  User, Bell, Lock, Star, Slash, EyeOff,
  MessageCircle, Tag, MessageSquare, Share2,
  ShieldOff, Filter, VolumeX, Sliders, Heart, Bookmark
} from 'lucide-react'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

// Types discriminants pour sections et liens
type SectionItem = { section: string }
type LinkItem = { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; href: string }
type MenuItem = SectionItem | LinkItem

const menu: MenuItem[] = [
  { icon: User, label: 'Edit profile', href: '/settings/profile' },
  { icon: Bell, label: 'Notifications', href: '/settings/notifications' },
  { section: 'Who can see your content' },
  { icon: Lock, label: 'Account privacy', href: '/settings/privacy' },
  { icon: Star, label: 'Close Friends', href: '/settings/close-friends' },
  { icon: Slash, label: 'Blocked', href: '/settings/blocked' },
  { icon: EyeOff, label: 'Hide story and live', href: '/settings/hide-story' },
  { section: 'How others can interact with you' },
  { icon: MessageCircle, label: 'Messages and story replies', href: '/settings/messages' },
  { icon: Tag, label: 'Tags and mentions', href: '/settings/tags' },
  { icon: MessageSquare, label: 'Comments', href: '/settings/comments' },
  { icon: Share2, label: 'Sharing and reuse', href: '/settings/sharing' },
  { icon: ShieldOff, label: 'Restricted accounts', href: '/settings/restricted' },
  { icon: Filter, label: 'Hidden Words', href: '/settings/hidden-words' },
  { section: 'What you see' },
  { icon: VolumeX, label: 'Muted accounts', href: '/settings/muted' },
  { icon: Sliders, label: 'Content preferences', href: '/settings/content-prefs' },
  { icon: Heart, label: 'Like and share counts', href: '/settings/like-share-counts' },
  { icon: Bookmark, label: 'Subscriptions', href: '/settings/subscriptions' },
]

export default function Settings() {
  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="p-5 border-b-1 border-[var(--detailMinimal)] bg-[var(--bgLevel1)]">
        <h1 className="text-xl font-semibold text-blue">Settings</h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        {menu.map((item, i) => {
          if ('section' in item) {
            return (
              <h2 key={i} className="text-sm font-medium text-[var(--detail)] mt-6">
                {item.section}
              </h2>
            )
          }
      
          const Icon = item.icon
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center p-3 bg-[var(--bgLevel2)] rounded-xl hover:bg-[var(--bgLevel3)] transition"
            >
              <Icon className="w-5 h-5 mr-3 text-[var(--detail)]" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </main>
    </div>
  )
}

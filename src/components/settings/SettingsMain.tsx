'use client'

import { useState } from 'react'
import {
  User, Bell, Lock, Star, Slash, EyeOff,
  MessageCircle, Tag, MessageSquare, Share2,
  ShieldOff, Filter, VolumeX, Sliders, Heart, Bookmark,
  ChevronLeft, ChevronRight, Settings,
  Home
} from 'lucide-react'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

type SectionItem = { section: string }
type LinkItem = { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; href: string }
type MenuItem = SectionItem | LinkItem

const menu: MenuItem[] = [
  { icon: Home, label: 'Return to feed', href: '/' },
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

export default function SettingsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`
        h-screen bg-[var(--bgLevel1)] border-r border-[var(--detailMinimal)] 
        transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? 'w-16' : 'w-80'}
      `}
    >
      {/* Header avec bouton toggle */}
      <div className="p-4 border-b border-[var(--detailMinimal)] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-semibold text-blue-500">Settings</h1>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[var(--bgLevel2)] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[var(--detail)]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[var(--detail)]" />
          )}
        </button>
      </div>

      {/* Menu scrollable */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menu.map((item, i) => {
          if ('section' in item) {
            if (isCollapsed) {
              return (
                <div key={i} className="h-px bg-[var(--detailMinimal)] mx-2 my-4" />
              )
            }
            return (
              <h2 key={i} className="text-xs font-medium text-[var(--detail)] px-3 py-2 mt-4 first:mt-2">
                {item.section}
              </h2>
            )
          }

          const Icon = item.icon
          return (
            <Link
              key={i}
              href={item.href}
              className={`
                flex items-center rounded-lg hover:bg-[var(--bgLevel2)] transition-colors
                ${isCollapsed ? 'p-3 justify-center' : 'p-3'}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 text-[var(--detail)] flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm text-[var(--text)]">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
"use client"

import { ChevronLeft, UserPlus, UserMinus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface CloseFriendsPageProps {
    onBack?: () => void
}

export default function CloseFriendsPage({ onBack }: CloseFriendsPageProps) {
    const [shareOnlyWithCloseFriends, setShareOnlyWithCloseFriends] = useState(false)
    const [closeFriendsList, setCloseFriendsList] = useState<string[]>([
        'alice123',
        'bob_the_builder',
        'charlie_chaplin'
    ])

    const addFriend = () => {
        const name = prompt('Enter username to add to Close Friends:')
        if (name && !closeFriendsList.includes(name)) {
            setCloseFriendsList((prev) => [...prev, name])
        }
    }

    const removeFriend = (username: string) => {
        setCloseFriendsList((prev) => prev.filter((u) => u !== username))
    }

    return (
        <div className="min-h-screen bg-[var(--bgLevel1)]">
            <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-[var(--bgLevel1)] z-40">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-semibold text-lg">Close Friends</h1>
            </header>

            <div className="p-4 space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
                    <span className="text-[var(--textMinimal)] font-medium">Share Story Only With Close Friends</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={shareOnlyWithCloseFriends}
                            onChange={() => setShareOnlyWithCloseFriends(!shareOnlyWithCloseFriends)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--detailMinimal)] rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-400 transition"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                    </label>
                </div>

                <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
                    <p className="text-sm text-[var(--textNeutral)]">
                        When enabled, only users in your Close Friends list will see your story updates.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
                        <h2 className="text-lg font-medium text-[var(--textMinimal)] mb-4">Close Friends List</h2>

                        {closeFriendsList.length === 0 ? (
                            <p className="text-sm text-[var(--textNeutral)] text-center py-8">
                                Your list is empty. Add people to your Close Friends list.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {closeFriendsList.map((username) => (
                                    <div
                                        key={username}
                                        className="flex justify-between items-center p-3 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] rounded-lg"
                                    >
                                        <span className="text-[var(--textMinimal)]">{username}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFriend(username)}
                                            className="text-[var(--textNeutral)] hover:text-red-600 hover:bg-red-50"
                                        >
                                            <UserMinus className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={addFriend}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-[var(--detailMinimal)] bg-[var(--bgLevel2)] text-[var(--textMinimal)] hover:bg-[var(--bgLevel1)]"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Add Close Friend</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
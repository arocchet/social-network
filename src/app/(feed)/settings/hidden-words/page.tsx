// src/app/(feed)/settings/hidden-words/page.tsx
'use client'

import { ChevronLeft, MinusCircle, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HiddenWordsSettings() {
  const [hiddenWords, setHiddenWords] = useState<string[]>([
    'spoiler',
    'politics',
    'ads'
  ])

  const removeWord = (word: string) => {
    setHiddenWords(prev => prev.filter(w => w !== word))
  }

  const addWord = () => {
    const word = prompt('Enter word or phrase to hide:')
    if (word && !hiddenWords.includes(word)) {
      setHiddenWords(prev => [...prev, word])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Hidden Words</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Words & Phrases</h2>

          {hiddenWords.length === 0 ? (
            <p className="text-sm text-gray-400">
              You haven’t hidden any words or phrases yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {hiddenWords.map(word => (
                <li
                  key={word}
                  className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
                >
                  <span className="text-white">{word}</span>
                  <button
                    onClick={() => removeWord(word)}
                    className="flex items-center text-gray-400 hover:text-white transition"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={addWord}
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
          >
            <PlusCircle className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-white">Add Word or Phrase</span>
          </button>
        </div>
      </div>
    </div>
  )
}

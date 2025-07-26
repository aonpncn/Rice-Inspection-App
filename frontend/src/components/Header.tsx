'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full h-[60px] bg-gray-200 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-900">EASYRICE TEST</h1>
      <Link href="/history">
        <button className="px-4 py-2 text-green-700 border border-green-700 rounded hover:bg-green-700/5">
          View History
        </button>
      </Link>
    </header>
  )
}

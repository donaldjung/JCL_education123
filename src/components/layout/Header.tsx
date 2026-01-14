import { Search, Terminal, Bell } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 h-16 bg-mainframe-darker/80 backdrop-blur-md border-b border-mainframe-amber/20 px-8 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search JCL documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-mainframe-terminal border border-mainframe-amber/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-mainframe-amber/50 focus:ring-1 focus:ring-mainframe-amber/30 transition-all font-mono text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-mainframe-dark rounded text-xs text-gray-500 border border-gray-700">
          ⌘K
        </kbd>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-mainframe-amber/10 rounded-full border border-mainframe-amber/30">
          <div className="w-2 h-2 rounded-full bg-mainframe-amber animate-pulse" />
          <span className="text-mainframe-amber text-xs font-mono">z/OS</span>
        </div>

        {/* Terminal toggle */}
        <button className="p-2 text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded-lg transition-all">
          <Terminal size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-cyan rounded-full" />
        </button>

        {/* Version badge */}
        <div className="px-3 py-1 bg-mainframe-terminal rounded-md border border-mainframe-amber/20">
          <span className="text-xs font-mono text-mainframe-amber">MVS/ESA</span>
        </div>
      </div>
    </header>
  )
}

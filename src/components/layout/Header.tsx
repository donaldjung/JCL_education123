import { Search, Terminal, Bell, X, FileText, Code, BookOpen, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Search data for JCL modules and tools
const searchData = [
  { 
    title: 'JCL Fundamentals', 
    path: '/module/1', 
    type: 'module',
    keywords: ['basics', 'introduction', 'job', 'jcl', 'statement', 'syntax', 'columns', 'structure'],
    description: 'JOB statements, basic syntax, and JCL structure'
  },
  { 
    title: 'DD Statements', 
    path: '/module/2', 
    type: 'module',
    keywords: ['dd', 'dataset', 'dsn', 'disp', 'dcb', 'space', 'unit', 'vol', 'allocation'],
    description: 'Dataset definitions, DISP, DCB, SPACE parameters'
  },
  { 
    title: 'EXEC Statements', 
    path: '/module/3', 
    type: 'module',
    keywords: ['exec', 'pgm', 'program', 'parm', 'cond', 'return code', 'step', 'execution'],
    description: 'Program execution, PARM, COND, and step control'
  },
  { 
    title: 'Procedures', 
    path: '/module/4', 
    type: 'module',
    keywords: ['proc', 'procedure', 'cataloged', 'instream', 'symbolic', 'override', 'jcllib'],
    description: 'Cataloged and in-stream procedures, symbolic parameters'
  },
  { 
    title: 'VSAM & IDCAMS', 
    path: '/module/5', 
    type: 'module',
    keywords: ['vsam', 'idcams', 'ksds', 'esds', 'rrds', 'cluster', 'define', 'repro', 'listcat'],
    description: 'VSAM dataset management with IDCAMS'
  },
  { 
    title: 'Utilities', 
    path: '/module/6', 
    type: 'module',
    keywords: ['iebgener', 'iebcopy', 'iefbr14', 'sort', 'dfsort', 'icetool', 'utility', 'copy'],
    description: 'IEBGENER, IEBCOPY, SORT, and system utilities'
  },
  { 
    title: 'Financial Patterns', 
    path: '/module/7', 
    type: 'module',
    keywords: ['banking', 'batch', 'production', 'scheduling', 'restart', 'recovery', 'gdg', 'archive'],
    description: 'Banking JCL patterns and production standards'
  },
  { 
    title: 'Playground', 
    path: '/playground', 
    type: 'tool',
    keywords: ['editor', 'code', 'validate', 'test', 'try', 'practice', 'write'],
    description: 'Interactive JCL code editor'
  },
  { 
    title: 'Cheat Sheet', 
    path: '/cheatsheet', 
    type: 'tool',
    keywords: ['reference', 'quick', 'syntax', 'parameters', 'statements', 'guide'],
    description: 'Quick reference for JCL syntax'
  },
  { 
    title: 'Glossary', 
    path: '/glossary', 
    type: 'tool',
    keywords: ['terms', 'definitions', 'mainframe', 'vocabulary', 'meaning', 'zos'],
    description: 'Mainframe and JCL terminology'
  },
]

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Filter results based on search query
  const searchResults = searchQuery.trim() === '' 
    ? searchData 
    : searchData.filter(item => {
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        )
      })

  // Keyboard shortcut to open search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Handle keyboard navigation in results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault()
      navigateToResult(searchResults[selectedIndex].path)
    }
  }

  const navigateToResult = (path: string) => {
    navigate(path)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'module': return <FileText size={16} className="text-jcl-green" />
      case 'tool': return <Code size={16} className="text-accent-cyan" />
      default: return <BookOpen size={16} className="text-gray-400" />
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-mainframe-darker/80 backdrop-blur-md border-b border-jcl-green/20 px-8 flex items-center justify-between">
        {/* Search trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="relative w-96 flex items-center"
        >
          <Search className="absolute left-3 text-gray-500" size={18} />
          <div className="w-full pl-10 pr-4 py-2 bg-mainframe-terminal border border-jcl-green/20 rounded-lg text-gray-500 text-left font-mono text-sm cursor-pointer hover:border-jcl-green/40 transition-all">
            Search documentation...
          </div>
          <kbd className="absolute right-3 px-2 py-0.5 bg-mainframe-dark rounded text-xs text-gray-500 border border-gray-700">
            ⌘K
          </kbd>
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-jcl-green/10 rounded-full border border-jcl-green/30">
            <div className="w-2 h-2 rounded-full bg-jcl-green animate-pulse" />
            <span className="text-jcl-green text-xs font-mono">z/OS</span>
          </div>

          {/* Terminal toggle */}
          <button className="p-2 text-gray-400 hover:text-jcl-green hover:bg-jcl-green/10 rounded-lg transition-all">
            <Terminal size={20} />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-cyan rounded-full" />
          </button>

          {/* Version badge */}
          <div className="px-3 py-1 bg-mainframe-terminal rounded-md border border-jcl-green/20">
            <span className="text-xs font-mono text-jcl-amber">JES2</span>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
            }}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-mainframe-darker border border-jcl-green/30 rounded-xl shadow-2xl shadow-jcl-green/10 overflow-hidden">
            {/* Search input */}
            <div className="flex items-center px-4 border-b border-jcl-green/20">
              <Search className="text-jcl-green" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search modules, tools, and documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 px-4 py-4 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none font-mono"
              />
              <button 
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-jcl-green/10 rounded transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.path}
                      onClick={() => navigateToResult(result.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                        index === selectedIndex 
                          ? 'bg-jcl-green/10 border-l-2 border-jcl-green' 
                          : 'hover:bg-jcl-green/5 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-mainframe-terminal rounded-lg">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-200 font-medium truncate">{result.title}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            result.type === 'module' 
                              ? 'bg-jcl-green/20 text-jcl-green' 
                              : 'bg-accent-cyan/20 text-accent-cyan'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{result.description}</p>
                      </div>
                      <ArrowRight size={16} className={`flex-shrink-0 transition-opacity ${
                        index === selectedIndex ? 'text-jcl-green opacity-100' : 'opacity-0'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-jcl-green/20 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-mainframe-terminal rounded border border-gray-700">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-mainframe-terminal rounded border border-gray-700">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-mainframe-terminal rounded border border-gray-700">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-mainframe-terminal rounded border border-gray-700">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

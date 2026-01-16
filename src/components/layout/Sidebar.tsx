import { NavLink } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Database, 
  Play, 
  FolderCog, 
  HardDrive, 
  Wrench, 
  Building2,
  Code2,
  FileCode,
  Library
} from 'lucide-react'
import { cn } from '../../lib/utils'

const modules = [
  { id: 1, title: 'JCL Fundamentals', icon: BookOpen, path: '/module/1' },
  { id: 2, title: 'DD Statements', icon: Database, path: '/module/2' },
  { id: 3, title: 'EXEC & Programs', icon: Play, path: '/module/3' },
  { id: 4, title: 'Procedures', icon: FolderCog, path: '/module/4' },
  { id: 5, title: 'VSAM & IDCAMS', icon: HardDrive, path: '/module/5' },
  { id: 6, title: 'Utilities', icon: Wrench, path: '/module/6' },
  { id: 7, title: 'Financial Patterns', icon: Building2, path: '/module/7' },
]

const tools = [
  { title: 'Playground', icon: Code2, path: '/playground' },
  { title: 'Cheat Sheet', icon: FileCode, path: '/cheatsheet' },
  { title: 'Glossary', icon: Library, path: '/glossary' },
]

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-mainframe-darker border-r border-mainframe-amber/20 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-mainframe-amber/20">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-mainframe-amber/20 flex items-center justify-center border border-mainframe-amber/40 group-hover:bg-mainframe-amber/30 transition-all">
            <span className="text-mainframe-amber font-mono font-bold text-sm">JCL</span>
          </div>
          <div>
            <h1 className="text-mainframe-amber font-display font-bold text-lg leading-tight">
              JCL
            </h1>
            <span className="text-gray-500 text-xs font-mono">z/OS Education</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Home */}
        <div className="px-3 mb-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-mainframe-amber/10 text-mainframe-amber border-l-2 border-mainframe-amber'
                  : 'text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/5'
              )
            }
          >
            <Home size={18} />
            <span className="font-medium">Home</span>
          </NavLink>
        </div>

        {/* Modules Section */}
        <div className="px-3 mb-2">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Modules
          </h3>
          <div className="space-y-1">
            {modules.map((module) => (
              <NavLink
                key={module.id}
                to={module.path}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-mainframe-amber/10 text-mainframe-amber border-l-2 border-mainframe-amber'
                      : 'text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/5'
                  )
                }
              >
                <module.icon size={16} />
                <span className="text-sm">
                  <span className="font-mono text-xs mr-1 opacity-60">{module.id}.</span>
                  {module.title}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="px-3 mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tools
          </h3>
          <div className="space-y-1">
            {tools.map((tool) => (
              <NavLink
                key={tool.title}
                to={tool.path}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                      : 'text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/5'
                  )
                }
              >
                <tool.icon size={16} />
                <span className="text-sm">{tool.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer with LinkedIn & Watermark */}
      <div className="p-4 border-t border-mainframe-amber/20">
        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/in/donald-jung/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg mb-3 transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #0077b5 0%, #005582 100%)',
            boxShadow: '0 4px 15px rgba(0, 119, 181, 0.3)'
          }}
        >
          <LinkedInIcon />
          <span className="text-white text-sm font-medium">Connect on LinkedIn</span>
        </a>
        
        {/* Watermark */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-1">crafted with ♥ by</p>
          <p 
            className="text-sm font-semibold tracking-wide"
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Donald Jung
          </p>
        </div>
      </div>
    </aside>
  )
}

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

      {/* Footer */}
      <div className="p-4 border-t border-mainframe-amber/20">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-mono">
            IBM z/OS Mainframe
          </p>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Training Platform v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}

import { Terminal, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface OutputDisplayProps {
  output: string
  title?: string
  className?: string
  onClose?: () => void
  isError?: boolean
}

export default function OutputDisplay({
  output,
  title = 'JES2 Output',
  className,
  onClose,
  isError = false,
}: OutputDisplayProps) {
  return (
    <div className={cn('terminal-window', className)}>
      {/* Header */}
      <div className={cn(
        'terminal-header',
        isError ? 'border-red-500/30' : 'border-mainframe-amber/30'
      )}>
        <Terminal size={16} className={isError ? 'text-red-500' : 'text-mainframe-amber'} />
        <span className={cn(
          'ml-2 text-sm font-mono',
          isError ? 'text-red-500' : 'text-mainframe-amber'
        )}>
          {title}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Output content */}
      <div className="p-4 font-mono text-sm">
        <pre className={cn(
          'whitespace-pre-wrap',
          isError ? 'text-red-400' : 'text-gray-300'
        )}>
          {output}
        </pre>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Copy, Check, Play } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CodeBlockProps {
  code: string
  title?: string
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  onRun?: () => void
}

export default function CodeBlock({
  code,
  title,
  language = 'jcl',
  showLineNumbers = true,
  highlightLines = [],
  className,
  onRun,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.trim().split('\n')

  const highlightJCL = (line: string): string => {
    // Handle comments
    if (line.trim().startsWith('//*') || line.trim() === '/*') {
      return `<span class="text-gray-500 italic">${line}</span>`
    }

    const keywords = ['JOB', 'EXEC', 'DD', 'PROC', 'PEND', 'IF', 'THEN', 'ELSE', 'ENDIF', 'SET', 'INCLUDE', 'JCLLIB']
    const parameters = [
      'PGM', 'PARM', 'COND', 'TIME', 'REGION', 'CLASS', 'MSGCLASS', 'MSGLEVEL', 'NOTIFY', 'TYPRUN',
      'DSN', 'DISP', 'DCB', 'SPACE', 'UNIT', 'VOL', 'SYSOUT', 'DUMMY',
      'RECFM', 'LRECL', 'BLKSIZE', 'NEW', 'OLD', 'SHR', 'MOD', 'CATLG', 'DELETE', 'KEEP', 'PASS',
      'CYL', 'TRK', 'RLSE', 'STEPLIB', 'SYSIN', 'SYSPRINT', 'SYSUT1', 'SYSUT2'
    ]

    let result = line
      // Strings in single quotes
      .replace(/'([^']*)'/g, '<span class="text-accent-orange">\'$1\'</span>')

    // Keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      result = result.replace(regex, '<span class="text-mainframe-amber font-semibold">$1</span>')
    })

    // Parameters
    parameters.forEach(param => {
      const regex = new RegExp(`\\b(${param})\\b`, 'g')
      result = result.replace(regex, '<span class="text-mainframe-green">$1</span>')
    })

    // Dataset names (highlight text after DSN=)
    result = result.replace(/(DSN=)([A-Z0-9.()&+-]+)/gi, '$1<span class="text-white font-medium">$2</span>')

    // Numbers
    result = result.replace(/\b(\d+)\b/g, '<span class="text-accent-cyan">$1</span>')

    return result
  }

  return (
    <div className={cn('terminal-window', className)}>
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        <span className="ml-3 text-gray-400 text-sm font-mono flex-1">
          {title || `${language.toUpperCase()}`}
        </span>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={onRun}
              className="p-1.5 text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded transition-all"
              title="Run code"
            >
              <Play size={14} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded transition-all"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-mainframe-green" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                highlightLines.includes(index + 1) && 'bg-mainframe-amber/10 -mx-4 px-4'
              )}
            >
              {showLineNumbers && (
                <span className="select-none text-gray-600 w-8 text-right mr-4 flex-shrink-0">
                  {index + 1}
                </span>
              )}
              <code
                className="flex-1"
                dangerouslySetInnerHTML={{
                  __html: language === 'jcl' ? highlightJCL(line) : line
                }}
              />
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

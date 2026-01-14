import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function highlightJCL(code: string): string {
  const keywords = [
    'JOB', 'EXEC', 'DD', 'PROC', 'PEND', 'IF', 'THEN', 'ELSE', 'ENDIF',
    'SET', 'JCLLIB', 'INCLUDE', 'OUTPUT', 'CNTL', 'ENDCNTL'
  ]

  const parameters = [
    'PGM', 'PROC', 'PARM', 'COND', 'TIME', 'REGION', 'ACCT', 'CLASS',
    'MSGCLASS', 'MSGLEVEL', 'NOTIFY', 'TYPRUN', 'RESTART', 'RD',
    'DSN', 'DISP', 'DCB', 'SPACE', 'UNIT', 'VOL', 'LABEL', 'SYSOUT',
    'DUMMY', 'DATA', 'DLM', 'DEST', 'HOLD', 'COPIES', 'BURST',
    'RECFM', 'LRECL', 'BLKSIZE', 'DSORG', 'KEYLEN', 'BUFNO',
    'NEW', 'OLD', 'SHR', 'MOD', 'CATLG', 'UNCATLG', 'DELETE', 'KEEP', 'PASS',
    'CYL', 'TRK', 'RLSE', 'CONTIG', 'MXIG', 'ALX', 'ROUND'
  ]

  let highlighted = code
  
  // Handle comments (lines starting with //* or lines with just //)
  highlighted = highlighted.replace(/^(\/\/\*.*)$/gm, '<span class="jcl-comment">$1</span>')
  
  // Handle in-stream data delimiter
  highlighted = highlighted.replace(/^(\/\*)$/gm, '<span class="jcl-comment">$1</span>')

  // Highlight keywords (JOB, EXEC, DD, etc.)
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    highlighted = highlighted.replace(regex, '<span class="jcl-keyword">$1</span>')
  })

  // Highlight parameters
  parameters.forEach(param => {
    const regex = new RegExp(`\\b(${param})\\b`, 'g')
    highlighted = highlighted.replace(regex, '<span class="jcl-param">$1</span>')
  })

  // Highlight quoted strings
  highlighted = highlighted.replace(/'([^']*)'/g, '<span class="jcl-value">\'$1\'</span>')

  // Highlight dataset names (after DSN=)
  highlighted = highlighted.replace(/(DSN=)([A-Z0-9.()+-]+)/gi, '$1<span class="jcl-dsn">$2</span>')

  return highlighted
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

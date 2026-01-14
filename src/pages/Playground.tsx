import { useState } from 'react'
import { Play, RotateCcw, Download, Copy, Check, AlertTriangle, CheckCircle2 } from 'lucide-react'

const defaultJCL = `//MYJOB    JOB (ACCT,123),'MY JOB NAME',
//             CLASS=A,
//             MSGCLASS=X,
//             MSGLEVEL=(1,1),
//             NOTIFY=&SYSUID
//*
//*  YOUR JCL CODE HERE
//*
//STEP01   EXEC PGM=IEFBR14
//NEWFILE  DD DSN=MY.NEW.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5),RLSE),
//            DCB=(RECFM=FB,LRECL=80,BLKSIZE=0)
//`

const exampleTemplates = [
  {
    name: 'Basic Job',
    code: `//BASICJOB JOB (ACCT),'BASIC JOB',CLASS=A,MSGCLASS=X
//*
//STEP01   EXEC PGM=IEFBR14
//SYSPRINT DD SYSOUT=*
//`
  },
  {
    name: 'Copy File (IEBGENER)',
    code: `//COPYJOB  JOB (ACCT),'COPY FILE',CLASS=A,MSGCLASS=X
//*
//COPY     EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
//SYSUT1   DD DSN=INPUT.FILE,DISP=SHR
//SYSUT2   DD DSN=OUTPUT.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE),
//            DCB=(RECFM=FB,LRECL=100)
//`
  },
  {
    name: 'Sort Job',
    code: `//SORTJOB  JOB (ACCT),'SORT DATA',CLASS=A,MSGCLASS=X
//*
//SORT     EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=OUTPUT.SORTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50),RLSE)
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)
/*
//`
  },
  {
    name: 'IDCAMS VSAM',
    code: `//VSAMJOB  JOB (ACCT),'VSAM OPERATIONS',CLASS=A,MSGCLASS=X
//*
//DEFVSAM  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE CLUSTER -
         (NAME(MY.VSAM.FILE) -
          INDEXED -
          RECORDSIZE(100 100) -
          KEYS(10 0) -
          FREESPACE(20 10)) -
         DATA -
          (CYLINDERS(10 5)) -
         INDEX -
          (CYLINDERS(2 1))
/*
//`
  },
  {
    name: 'Multi-Step Job',
    code: `//MULTIJOB JOB (ACCT),'MULTI-STEP',CLASS=A,MSGCLASS=X
//*
//STEP01   EXEC PGM=EXTRACT
//INPUT    DD DSN=SOURCE.FILE,DISP=SHR
//OUTPUT   DD DSN=&&TEMP,DISP=(NEW,PASS)
//SYSPRINT DD SYSOUT=*
//*
//         IF (STEP01.RC = 0) THEN
//STEP02   EXEC PGM=PROCESS
//INPUT    DD DSN=*.STEP01.OUTPUT,DISP=(OLD,DELETE)
//OUTPUT   DD DSN=FINAL.FILE,DISP=(NEW,CATLG)
//SYSPRINT DD SYSOUT=*
//         ENDIF
//*
//CLEANUP  EXEC PGM=CLEANUP,COND=EVEN
//SYSPRINT DD SYSOUT=*
//`
  }
]

interface ValidationResult {
  line: number
  type: 'error' | 'warning'
  message: string
}

export default function Playground() {
  const [code, setCode] = useState(defaultJCL)
  const [output, setOutput] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [copied, setCopied] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const validateJCL = (jcl: string): ValidationResult[] => {
    const results: ValidationResult[] = []
    const lines = jcl.split('\n')
    
    let hasJobStatement = false
    
    lines.forEach((line, index) => {
      const lineNum = index + 1
      
      // Check for JOB statement
      if (line.match(/^\/\/\w+\s+JOB\s/i)) {
        hasJobStatement = true
      }
      
      // Check line length (max 71 characters for content, 72 for continuation)
      if (line.length > 72 && !line.startsWith('//*')) {
        results.push({
          line: lineNum,
          type: 'warning',
          message: 'Line exceeds 72 characters - may be truncated'
        })
      }
      
      // Check for common syntax errors
      if (line.trim().startsWith('//') && !line.trim().startsWith('//*')) {
        // Check name field (columns 3-10)
        const nameMatch = line.match(/^\/\/(\w{9,})/)
        if (nameMatch && !line.includes(' ')) {
          results.push({
            line: lineNum,
            type: 'error',
            message: 'Name field exceeds 8 characters'
          })
        }
        
        // Check for lowercase (JCL should be uppercase)
        if (line !== line.toUpperCase() && !line.includes("'")) {
          // Allow lowercase inside quoted strings
          const withoutStrings = line.replace(/'[^']*'/g, '')
          if (withoutStrings !== withoutStrings.toUpperCase()) {
            results.push({
              line: lineNum,
              type: 'warning',
              message: 'JCL typically uses uppercase - lowercase may cause issues'
            })
          }
        }
      }
      
      // Check DD statement
      if (line.match(/^\s*\/\/\w*\s+DD\s/i)) {
        // Check for DISP parameter
        if (!line.includes('DISP=') && !line.includes('SYSOUT=') && !line.includes('DUMMY') && !line.includes('*')) {
          results.push({
            line: lineNum,
            type: 'warning',
            message: 'DD statement may need DISP parameter'
          })
        }
      }
      
      // Check for unmatched quotes
      const singleQuotes = (line.match(/'/g) || []).length
      if (singleQuotes % 2 !== 0 && !line.endsWith(',')) {
        results.push({
          line: lineNum,
          type: 'error',
          message: 'Unmatched single quote'
        })
      }
      
      // Check for IF without ENDIF context
      if (line.match(/^\s*\/\/\s+IF\s*\(/)) {
        // Basic check - would need more sophisticated parsing for full validation
      }
    })
    
    // Check if JOB statement exists
    if (!hasJobStatement && lines.length > 0) {
      results.push({
        line: 1,
        type: 'error',
        message: 'Missing JOB statement - every job must begin with a JOB statement'
      })
    }
    
    return results
  }

  const handleValidate = () => {
    setIsValidating(true)
    
    // Simulate validation delay
    setTimeout(() => {
      const results = validateJCL(code)
      setValidationResults(results)
      
      if (results.length === 0) {
        setOutput(`JCL SYNTAX CHECK COMPLETE
========================
STATUS: VALID
TIME: ${new Date().toLocaleTimeString()}

NO ERRORS OR WARNINGS FOUND.

JCL IS READY FOR SUBMISSION.`)
      } else {
        const errors = results.filter(r => r.type === 'error').length
        const warnings = results.filter(r => r.type === 'warning').length
        
        setOutput(`JCL SYNTAX CHECK COMPLETE
========================
STATUS: ${errors > 0 ? 'ERRORS FOUND' : 'WARNINGS ONLY'}
ERRORS: ${errors}
WARNINGS: ${warnings}
TIME: ${new Date().toLocaleTimeString()}

REVIEW THE ISSUES PANEL FOR DETAILS.`)
      }
      
      setIsValidating(false)
    }, 500)
  }

  const handleReset = () => {
    setCode(defaultJCL)
    setOutput(null)
    setValidationResults([])
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job.jcl'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTemplateSelect = (template: typeof exampleTemplates[0]) => {
    setCode(template.code)
    setOutput(null)
    setValidationResults([])
  }

  const highlightJCL = (line: string): string => {
    if (line.trim().startsWith('//*') || line.trim() === '/*') {
      return `<span class="text-gray-500 italic">${line}</span>`
    }

    const keywords = ['JOB', 'EXEC', 'DD', 'PROC', 'PEND', 'IF', 'THEN', 'ELSE', 'ENDIF', 'SET', 'INCLUDE', 'JCLLIB']
    const parameters = [
      'PGM', 'PARM', 'COND', 'TIME', 'REGION', 'CLASS', 'MSGCLASS', 'MSGLEVEL', 'NOTIFY', 'TYPRUN',
      'DSN', 'DISP', 'DCB', 'SPACE', 'UNIT', 'VOL', 'SYSOUT', 'DUMMY',
      'RECFM', 'LRECL', 'BLKSIZE', 'NEW', 'OLD', 'SHR', 'MOD', 'CATLG', 'DELETE', 'KEEP', 'PASS'
    ]

    let result = line
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'([^']*)'/g, '<span class="text-accent-orange">&#39;$1&#39;</span>')

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      result = result.replace(regex, '<span class="text-mainframe-amber font-semibold">$1</span>')
    })

    parameters.forEach(param => {
      const regex = new RegExp(`\\b(${param})\\b`, 'g')
      result = result.replace(regex, '<span class="text-mainframe-green">$1</span>')
    })

    result = result.replace(/\b(\d+)\b/g, '<span class="text-accent-cyan">$1</span>')

    return result
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">JCL Playground</h1>
          <p className="text-gray-400 mt-1">Write and validate JCL syntax in real-time</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={18} />
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="card-dark">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Templates</h3>
        <div className="flex flex-wrap gap-2">
          {exampleTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplateSelect(template)}
              className="px-3 py-1.5 bg-mainframe-terminal text-gray-300 text-sm rounded-lg border border-mainframe-amber/20 hover:border-mainframe-amber/50 hover:text-mainframe-amber transition-all"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500" />
            <div className="terminal-dot bg-yellow-500" />
            <div className="terminal-dot bg-green-500" />
            <span className="ml-3 text-gray-400 text-sm font-mono flex-1">EDIT - JCL</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded transition-all"
                title="Copy code"
              >
                {copied ? <Check size={14} className="text-mainframe-green" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 text-gray-400 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded transition-all"
                title="Download JCL"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setValidationResults([])
              }}
              className="w-full h-[500px] p-4 bg-transparent text-transparent caret-mainframe-amber font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              style={{ 
                lineHeight: '1.6',
                tabSize: 2 
              }}
            />
            <pre 
              className="absolute top-0 left-0 w-full h-full p-4 font-mono text-sm pointer-events-none overflow-auto"
              style={{ lineHeight: '1.6' }}
            >
              {code.split('\n').map((line, i) => (
                <div 
                  key={i} 
                  className={`flex ${validationResults.some(r => r.line === i + 1) ? 'bg-red-500/10' : ''}`}
                >
                  <span className="select-none text-gray-600 w-8 text-right mr-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <code dangerouslySetInnerHTML={{ __html: highlightJCL(line) || '&nbsp;' }} />
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Output & Validation */}
        <div className="space-y-6">
          {/* Validation Results */}
          {validationResults.length > 0 && (
            <div className="terminal-window">
              <div className="terminal-header border-accent-orange/30">
                <AlertTriangle size={16} className="text-accent-orange" />
                <span className="ml-2 text-sm font-mono text-accent-orange">
                  Issues ({validationResults.length})
                </span>
              </div>
              <div className="p-4 max-h-48 overflow-y-auto">
                {validationResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 py-2 border-b border-mainframe-amber/10 last:border-0 ${
                      result.type === 'error' ? 'text-red-400' : 'text-accent-orange'
                    }`}
                  >
                    <span className="font-mono text-xs bg-mainframe-dark px-2 py-0.5 rounded">
                      Line {result.line}
                    </span>
                    <span className="text-sm">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-3 text-gray-400 text-sm font-mono">JES2 Output</span>
            </div>
            <div className="p-4 h-[300px] overflow-y-auto">
              {output ? (
                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <CheckCircle2 size={48} className="mb-4 opacity-30" />
                  <p className="text-sm">Click "Validate" to check your JCL syntax</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="card-dark">
            <h3 className="text-mainframe-amber font-semibold mb-3">JCL Tips</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Lines should not exceed 71 characters (72 for continuation)</li>
              <li>• Column 72 continuation indicator required for multi-line statements</li>
              <li>• JCL is typically uppercase (lowercase may cause issues)</li>
              <li>• Every job must begin with a JOB statement</li>
              <li>• Use <code className="code-inline">//*</code> for comments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

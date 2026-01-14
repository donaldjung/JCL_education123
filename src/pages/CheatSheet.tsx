import { useState } from 'react'
import { Search, Copy, Check } from 'lucide-react'

interface CheatItem {
  parameter: string
  syntax: string
  description: string
  example: string
}

interface CheatSection {
  title: string
  items: CheatItem[]
}

const cheatData: CheatSection[] = [
  {
    title: 'JOB Statement Parameters',
    items: [
      { parameter: 'CLASS', syntax: 'CLASS=x', description: 'Job execution class (A-Z, 0-9)', example: 'CLASS=A' },
      { parameter: 'MSGCLASS', syntax: 'MSGCLASS=x', description: 'Output message class for JES messages', example: 'MSGCLASS=X' },
      { parameter: 'MSGLEVEL', syntax: 'MSGLEVEL=(stmt,msg)', description: 'Control JCL listing (0-2, 0-1)', example: 'MSGLEVEL=(1,1)' },
      { parameter: 'NOTIFY', syntax: 'NOTIFY=userid', description: 'TSO user to notify on completion', example: 'NOTIFY=&SYSUID' },
      { parameter: 'TIME', syntax: 'TIME=(min,sec) or TIME=min', description: 'CPU time limit for job', example: 'TIME=(10,30)' },
      { parameter: 'REGION', syntax: 'REGION=nK|nM|0M', description: 'Memory allocation for job', example: 'REGION=512M' },
      { parameter: 'TYPRUN', syntax: 'TYPRUN=SCAN|HOLD|COPY', description: 'Special job processing', example: 'TYPRUN=SCAN' },
      { parameter: 'RESTART', syntax: 'RESTART=stepname', description: 'Restart job from step', example: 'RESTART=STEP03' },
      { parameter: 'COND', syntax: 'COND=(code,op)', description: 'Job-level condition code test', example: 'COND=(4,LT)' },
    ]
  },
  {
    title: 'EXEC Statement Parameters',
    items: [
      { parameter: 'PGM', syntax: 'PGM=program', description: 'Program to execute', example: 'PGM=IEFBR14' },
      { parameter: 'PROC', syntax: 'PROC=procname', description: 'Procedure to invoke', example: 'PROC=SORTPROC' },
      { parameter: 'PARM', syntax: 'PARM=\'value\'', description: 'Parameters passed to program', example: 'PARM=\'DEBUG=ON\'' },
      { parameter: 'COND', syntax: 'COND=(code,op[,step])', description: 'Step condition test (bypass if true)', example: 'COND=(0,NE,STEP01)' },
      { parameter: 'TIME', syntax: 'TIME=(min,sec)', description: 'CPU time limit for step', example: 'TIME=(5,0)' },
      { parameter: 'REGION', syntax: 'REGION=nK|nM', description: 'Memory for step', example: 'REGION=256M' },
      { parameter: 'ACCT', syntax: 'ACCT=(acct-info)', description: 'Step accounting information', example: 'ACCT=(DEPT01)' },
    ]
  },
  {
    title: 'DD Statement - DSN & DISP',
    items: [
      { parameter: 'DSN', syntax: 'DSN=dataset.name', description: 'Data set name (1-44 chars)', example: 'DSN=PROD.DATA.FILE' },
      { parameter: 'DISP', syntax: 'DISP=(status,norm,abnorm)', description: 'Data set disposition', example: 'DISP=(NEW,CATLG,DELETE)' },
      { parameter: 'DISP=NEW', syntax: 'DISP=NEW', description: 'Create new data set', example: 'DISP=(NEW,CATLG)' },
      { parameter: 'DISP=OLD', syntax: 'DISP=OLD', description: 'Exclusive access to existing', example: 'DISP=OLD' },
      { parameter: 'DISP=SHR', syntax: 'DISP=SHR', description: 'Shared read access', example: 'DISP=SHR' },
      { parameter: 'DISP=MOD', syntax: 'DISP=MOD', description: 'Append or create', example: 'DISP=(MOD,CATLG)' },
      { parameter: 'CATLG', syntax: 'CATLG', description: 'Catalog data set', example: 'DISP=(NEW,CATLG)' },
      { parameter: 'DELETE', syntax: 'DELETE', description: 'Delete data set', example: 'DISP=(OLD,DELETE)' },
      { parameter: 'KEEP', syntax: 'KEEP', description: 'Keep uncataloged', example: 'DISP=(NEW,KEEP)' },
      { parameter: 'PASS', syntax: 'PASS', description: 'Pass to next step', example: 'DISP=(NEW,PASS)' },
    ]
  },
  {
    title: 'DD Statement - SPACE',
    items: [
      { parameter: 'SPACE', syntax: 'SPACE=(unit,(pri,sec,dir),opt)', description: 'Allocate disk space', example: 'SPACE=(CYL,(50,25))' },
      { parameter: 'CYL', syntax: 'SPACE=(CYL,(p,s))', description: 'Cylinder allocation', example: 'SPACE=(CYL,(100,50))' },
      { parameter: 'TRK', syntax: 'SPACE=(TRK,(p,s))', description: 'Track allocation', example: 'SPACE=(TRK,(10,5))' },
      { parameter: 'blksize', syntax: 'SPACE=(blksize,(p,s))', description: 'Block size allocation', example: 'SPACE=(27800,(1000,500))' },
      { parameter: 'RLSE', syntax: 'RLSE', description: 'Release unused space', example: 'SPACE=(CYL,(50,25),RLSE)' },
      { parameter: 'CONTIG', syntax: 'CONTIG', description: 'Contiguous allocation', example: 'SPACE=(CYL,(50),CONTIG)' },
      { parameter: 'Directory', syntax: '(p,s,dir)', description: 'PDS directory blocks', example: 'SPACE=(CYL,(10,5,50))' },
    ]
  },
  {
    title: 'DD Statement - DCB',
    items: [
      { parameter: 'DCB', syntax: 'DCB=(subparams)', description: 'Data control block attributes', example: 'DCB=(RECFM=FB,LRECL=80)' },
      { parameter: 'RECFM', syntax: 'RECFM=x', description: 'Record format', example: 'RECFM=FB' },
      { parameter: 'LRECL', syntax: 'LRECL=n', description: 'Logical record length', example: 'LRECL=80' },
      { parameter: 'BLKSIZE', syntax: 'BLKSIZE=n', description: 'Block size (0=optimal)', example: 'BLKSIZE=0' },
      { parameter: 'DSORG', syntax: 'DSORG=xx', description: 'Data set organization', example: 'DSORG=PS' },
      { parameter: 'F/FB', syntax: 'RECFM=F|FB', description: 'Fixed (blocked)', example: 'RECFM=FB' },
      { parameter: 'V/VB', syntax: 'RECFM=V|VB', description: 'Variable (blocked)', example: 'RECFM=VB' },
      { parameter: 'FBA/VBA', syntax: 'RECFM=FBA|VBA', description: 'With ASA control', example: 'RECFM=FBA' },
      { parameter: 'U', syntax: 'RECFM=U', description: 'Undefined length', example: 'RECFM=U' },
    ]
  },
  {
    title: 'DD Statement - Special',
    items: [
      { parameter: 'SYSOUT', syntax: 'SYSOUT=class', description: 'Output to JES spool', example: 'SYSOUT=*' },
      { parameter: 'DUMMY', syntax: 'DUMMY', description: 'Null file (no I/O)', example: 'DD DUMMY' },
      { parameter: '*', syntax: 'DD *', description: 'Instream data follows', example: 'DD *' },
      { parameter: 'DATA', syntax: 'DD DATA', description: 'Instream with JCL-like data', example: 'DD DATA,DLM=@@' },
      { parameter: 'DLM', syntax: 'DLM=xx', description: 'Instream delimiter', example: 'DLM=##' },
      { parameter: 'Concatenation', syntax: '// DD ...', description: 'Concatenate data sets', example: '// DD DSN=FILE2,DISP=SHR' },
      { parameter: 'Referback', syntax: 'DSN=*.step.dd', description: 'Reference previous DD', example: 'DSN=*.STEP01.OUTPUT' },
    ]
  },
  {
    title: 'COND Operators',
    items: [
      { parameter: 'GT', syntax: 'COND=(n,GT)', description: 'Greater than', example: 'COND=(4,GT)' },
      { parameter: 'GE', syntax: 'COND=(n,GE)', description: 'Greater than or equal', example: 'COND=(4,GE)' },
      { parameter: 'LT', syntax: 'COND=(n,LT)', description: 'Less than', example: 'COND=(4,LT)' },
      { parameter: 'LE', syntax: 'COND=(n,LE)', description: 'Less than or equal', example: 'COND=(4,LE)' },
      { parameter: 'EQ', syntax: 'COND=(n,EQ)', description: 'Equal to', example: 'COND=(0,EQ)' },
      { parameter: 'NE', syntax: 'COND=(n,NE)', description: 'Not equal to', example: 'COND=(0,NE)' },
      { parameter: 'EVEN', syntax: 'COND=EVEN', description: 'Execute even after abend', example: 'COND=EVEN' },
      { parameter: 'ONLY', syntax: 'COND=ONLY', description: 'Execute only after abend', example: 'COND=ONLY' },
    ]
  },
  {
    title: 'IF/THEN/ELSE',
    items: [
      { parameter: 'IF', syntax: 'IF (condition) THEN', description: 'Start conditional block', example: 'IF (STEP01.RC = 0) THEN' },
      { parameter: 'ELSE', syntax: 'ELSE', description: 'Alternative block', example: 'ELSE' },
      { parameter: 'ENDIF', syntax: 'ENDIF', description: 'End conditional block', example: 'ENDIF' },
      { parameter: 'RC', syntax: 'stepname.RC', description: 'Return code test', example: 'STEP01.RC <= 4' },
      { parameter: 'ABEND', syntax: 'stepname.ABEND', description: 'Test for abend', example: 'IF (STEP01.ABEND) THEN' },
      { parameter: 'RUN', syntax: 'stepname.RUN', description: 'Test if step ran', example: 'IF (STEP01.RUN) THEN' },
    ]
  },
  {
    title: 'IDCAMS Commands',
    items: [
      { parameter: 'DEFINE CLUSTER', syntax: 'DEFINE CLUSTER(NAME(...))', description: 'Create VSAM data set', example: 'DEFINE CLUSTER(NAME(X) INDEXED)' },
      { parameter: 'DELETE', syntax: 'DELETE name CLUSTER', description: 'Delete data set', example: 'DELETE MY.FILE CLUSTER' },
      { parameter: 'REPRO', syntax: 'REPRO INFILE() OUTFILE()', description: 'Copy data sets', example: 'REPRO INFILE(IN) OUTFILE(OUT)' },
      { parameter: 'PRINT', syntax: 'PRINT INFILE()', description: 'Print data set contents', example: 'PRINT INFILE(DD1) CHARACTER' },
      { parameter: 'LISTCAT', syntax: 'LISTCAT ENTRIES()', description: 'List catalog entry', example: 'LISTCAT ENTRIES(MY.*) ALL' },
      { parameter: 'ALTER', syntax: 'ALTER name params', description: 'Modify data set attributes', example: 'ALTER MY.FILE FREESPACE(20 10)' },
    ]
  },
  {
    title: 'SORT Control Statements',
    items: [
      { parameter: 'SORT', syntax: 'SORT FIELDS=(p,l,f,o,...)', description: 'Sort specification', example: 'SORT FIELDS=(1,10,CH,A)' },
      { parameter: 'INCLUDE', syntax: 'INCLUDE COND=(condition)', description: 'Select records', example: 'INCLUDE COND=(1,3,CH,EQ,C\'ACT\')' },
      { parameter: 'OMIT', syntax: 'OMIT COND=(condition)', description: 'Exclude records', example: 'OMIT COND=(10,1,CH,EQ,C\'X\')' },
      { parameter: 'SUM', syntax: 'SUM FIELDS=(p,l,f,...)', description: 'Summarize fields', example: 'SUM FIELDS=(20,8,PD)' },
      { parameter: 'OUTREC', syntax: 'OUTREC FIELDS=(...)', description: 'Reformat output', example: 'OUTREC FIELDS=(1,10,C\' \',11,20)' },
      { parameter: 'INREC', syntax: 'INREC FIELDS=(...)', description: 'Reformat input', example: 'INREC FIELDS=(1,80,C\'X\')' },
    ]
  },
]

export default function CheatSheet() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(id)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const filteredData = cheatData.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-bold text-white">JCL Cheat Sheet</h1>
        <p className="text-gray-400">Quick reference for JCL parameters and syntax</p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-mainframe-terminal border border-mainframe-amber/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-mainframe-amber/50 focus:ring-1 focus:ring-mainframe-amber/30 transition-all font-mono text-sm"
          />
        </div>
      </div>

      {/* Cheat Sheet Sections */}
      <div className="space-y-8">
        {filteredData.map((section) => (
          <section key={section.title} className="card-dark">
            <h2 className="section-title mb-4">{section.title}</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-32">Parameter</th>
                    <th className="w-48">Syntax</th>
                    <th>Description</th>
                    <th className="w-48">Example</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, index) => {
                    const itemId = `${section.title}-${index}`
                    return (
                      <tr key={itemId}>
                        <td className="text-mainframe-amber font-semibold">{item.parameter}</td>
                        <td><code className="text-mainframe-green">{item.syntax}</code></td>
                        <td className="text-gray-300">{item.description}</td>
                        <td><code className="text-accent-cyan">{item.example}</code></td>
                        <td>
                          <button
                            onClick={() => handleCopy(item.example, itemId)}
                            className="p-1 text-gray-500 hover:text-mainframe-amber transition-colors"
                            title="Copy example"
                          >
                            {copiedItem === itemId ? (
                              <Check size={14} className="text-mainframe-green" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* Quick Reference Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-highlight">
          <h3 className="text-mainframe-amber font-semibold mb-3">Return Code Standards</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between"><span className="text-mainframe-green">RC=0</span><span className="text-gray-400">Success</span></li>
            <li className="flex justify-between"><span className="text-mainframe-amber">RC=4</span><span className="text-gray-400">Warning</span></li>
            <li className="flex justify-between"><span className="text-accent-orange">RC=8</span><span className="text-gray-400">Error</span></li>
            <li className="flex justify-between"><span className="text-red-400">RC=12</span><span className="text-gray-400">Severe Error</span></li>
            <li className="flex justify-between"><span className="text-red-500">RC=16+</span><span className="text-gray-400">Critical Failure</span></li>
          </ul>
        </div>

        <div className="card-highlight">
          <h3 className="text-mainframe-amber font-semibold mb-3">Space Conversions</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>1 CYL = 15 TRK (3390)</li>
            <li>1 TRK ≈ 56,664 bytes</li>
            <li>1 CYL ≈ 849,960 bytes</li>
            <li>Half-track: ~27,998 bytes</li>
          </ul>
        </div>

        <div className="card-highlight">
          <h3 className="text-mainframe-amber font-semibold mb-3">Common DD Names</h3>
          <ul className="space-y-1 text-sm">
            <li><code className="text-mainframe-green">SYSIN</code> - <span className="text-gray-400">Input control cards</span></li>
            <li><code className="text-mainframe-green">SYSPRINT</code> - <span className="text-gray-400">Print output</span></li>
            <li><code className="text-mainframe-green">SYSOUT</code> - <span className="text-gray-400">Message output</span></li>
            <li><code className="text-mainframe-green">SYSUT1/2</code> - <span className="text-gray-400">Utility I/O</span></li>
            <li><code className="text-mainframe-green">STEPLIB</code> - <span className="text-gray-400">Load library</span></li>
          </ul>
        </div>
      </section>
    </div>
  )
}

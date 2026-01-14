import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Database, AlertTriangle, Info } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module2_DDStatements() {
  const dispDiagram = `
flowchart TD
    A[DISP Parameter] --> B[Status]
    A --> C[Normal End]
    A --> D[Abnormal End]
    
    B --> B1[NEW]
    B --> B2[OLD]
    B --> B3[SHR]
    B --> B4[MOD]
    
    C --> C1[CATLG]
    C --> C2[KEEP]
    C --> C3[DELETE]
    C --> C4[PASS]
    C --> C5[UNCATLG]
    
    D --> D1[CATLG]
    D --> D2[KEEP]
    D --> D3[DELETE]
    D --> D4[UNCATLG]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style C fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style D fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
`

  const spaceDiagram = `
flowchart LR
    A[SPACE Parameter] --> B[Unit Type]
    B --> B1[TRK - Tracks]
    B --> B2[CYL - Cylinders]
    B --> B3[bytes - Block size]
    
    A --> C[Primary]
    A --> D[Secondary]
    A --> E[Directory]
    A --> F[Options]
    F --> F1[RLSE]
    F --> F2[CONTIG]
    F --> F3[ROUND]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style C fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
`

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-mainframe-amber">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-mainframe-amber">Module 2</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-mainframe-green/10 flex items-center justify-center border border-mainframe-green/30">
            <Database className="text-mainframe-green" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">DD Statements</h1>
            <p className="text-gray-400 mt-1">Data Definition - DSN, DISP, DCB, SPACE, and more</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">Understanding DD Statements</h2>
        <p className="text-gray-300 leading-relaxed">
          The <strong className="text-mainframe-green">DD (Data Definition)</strong> statement is the 
          workhorse of JCL. It defines every data set that a program reads from or writes to. In financial 
          systems, proper DD statement configuration is critical for data integrity, security, and performance.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Each DD statement describes a data set's location, organization, record format, and disposition. 
          The DDname connects the logical file reference in your program to the physical data set on disk.
        </p>

        <CodeBlock
          title="Basic DD Statement Structure"
          code={`//ddname   DD  parameters
//
// Example:
//INFILE   DD  DSN=BANK.ACCOUNTS.MASTER,DISP=SHR
//OUTFILE  DD  DSN=BANK.ACCOUNTS.NEW,
//             DISP=(NEW,CATLG,DELETE),
//             SPACE=(CYL,(100,50),RLSE),
//             DCB=(RECFM=FB,LRECL=200,BLKSIZE=27800)`}
          language="jcl"
        />
      </section>

      {/* DSN Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">DSN (Data Set Name) Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">DSN</code> or <code className="code-inline">DSNAME</code> parameter 
          specifies the data set name. In financial institutions, naming conventions are strictly enforced for 
          organization and security.
        </p>

        <CodeBlock
          title="DSN Examples"
          code={`//* Permanent data set
//INPUT    DD DSN=PROD.FINANCE.ACCOUNTS.MASTER,DISP=SHR

//* Temporary data set (starts with && or &)
//TEMP     DD DSN=&&TEMPFILE,DISP=(NEW,PASS),
//            SPACE=(CYL,(10,5))

//* GDG (Generation Data Group) - current generation
//GDGCUR   DD DSN=BANK.TRANS.DAILY(0),DISP=SHR

//* GDG - new generation
//GDGNEW   DD DSN=BANK.TRANS.DAILY(+1),
//            DISP=(NEW,CATLG,DELETE)

//* GDG - previous generation
//GDGOLD   DD DSN=BANK.TRANS.DAILY(-1),DISP=SHR

//* PDS member
//MEMBER   DD DSN=PROD.JCL.LIBRARY(DAILYJOB),DISP=SHR

//* Referback to previous DD
//STEP02   EXEC PGM=MYPROG
//INPUT    DD DSN=*.STEP01.OUTFILE,DISP=SHR`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">Financial Institution Naming Conventions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Purpose</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">ENV.APP.TYPE.NAME</td>
                <td>Standard 4-level qualifier</td>
                <td><code>PROD.LOANS.MASTER.ACCOUNTS</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">PROD vs TEST vs DEV</td>
                <td>Environment identifier</td>
                <td><code>TEST.FINANCE.TRANS.DAILY</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Dated qualifiers</td>
                <td>Archival data sets</td>
                <td><code>PROD.ARCHIVE.D20240115</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">GDG base</td>
                <td>Generation data groups</td>
                <td><code>PROD.GL.EXTRACT.DAILY</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* DISP Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">DISP (Disposition) Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">DISP</code> parameter controls data set status and what happens 
          to it after the job. This is one of the most critical parameters for data integrity.
        </p>

        <FlowDiagram chart={dispDiagram} title="DISP Parameter Structure" />

        <CodeBlock
          title="DISP Syntax and Examples"
          code={`//         DISP=(status,normal-end,abnormal-end)
//
//* Read existing cataloged data set
//INPUT    DD DSN=BANK.ACCOUNTS,DISP=SHR

//* Create new, catalog on success, delete on failure
//OUTPUT   DD DSN=BANK.ACCOUNTS.NEW,
//            DISP=(NEW,CATLG,DELETE)

//* Update existing, keep regardless of outcome
//UPDATE   DD DSN=BANK.ACCOUNTS,DISP=(OLD,KEEP,KEEP)

//* Append to existing (MOD)
//APPEND   DD DSN=BANK.TRANS.LOG,DISP=(MOD,CATLG)

//* Pass to next step, delete at job end
//TEMP     DD DSN=&&WORK,DISP=(NEW,PASS,DELETE)

//* Delete data set after successful step
//CLEANUP  DD DSN=BANK.TEMP.FILE,DISP=(OLD,DELETE)`}
          language="jcl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3">Status Subparameter</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">NEW</code> - Create new data set</li>
              <li><code className="code-inline">OLD</code> - Exclusive access to existing</li>
              <li><code className="code-inline">SHR</code> - Shared access (read)</li>
              <li><code className="code-inline">MOD</code> - Append or create new</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3">Disposition Options</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">CATLG</code> - Catalog in system catalog</li>
              <li><code className="code-inline">KEEP</code> - Keep but don't catalog</li>
              <li><code className="code-inline">DELETE</code> - Delete the data set</li>
              <li><code className="code-inline">PASS</code> - Pass to subsequent step</li>
              <li><code className="code-inline">UNCATLG</code> - Remove from catalog</li>
            </ul>
          </div>
        </div>

        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-accent-orange flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-orange font-semibold mb-1">Critical for Production</h4>
            <p className="text-gray-300 text-sm">
              Always specify all three DISP subparameters for output data sets. The default abnormal 
              disposition may not be what you expect. In financial systems, improper DISP settings can 
              result in data loss or incomplete transactions.
            </p>
          </div>
        </div>
      </section>

      {/* DCB Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">DCB (Data Control Block) Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">DCB</code> parameter describes the physical characteristics 
          of the data set. While the system can often determine these from existing data sets, specifying 
          them for new data sets is essential.
        </p>

        <CodeBlock
          title="DCB Subparameters"
          code={`//OUTPUT   DD DSN=BANK.TRANS.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            DCB=(RECFM=FB,LRECL=200,BLKSIZE=27800)
//
//* Common DCB configurations:
//
//* Fixed blocked (most common for data files)
//DATA     DD DCB=(RECFM=FB,LRECL=100,BLKSIZE=27900)
//
//* Variable blocked (text, logs)
//LOG      DD DCB=(RECFM=VB,LRECL=32756,BLKSIZE=32760)
//
//* Fixed blocked with ASA carriage control (reports)
//REPORT   DD DCB=(RECFM=FBA,LRECL=133,BLKSIZE=27930)
//
//* Undefined (load modules)
//LOAD     DD DCB=(RECFM=U,BLKSIZE=32760)`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">DCB Subparameters Reference</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Description</th>
                <th>Common Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">RECFM</td>
                <td>Record format</td>
                <td>F, FB, V, VB, FBA, VBA, U</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">LRECL</td>
                <td>Logical record length</td>
                <td>80, 100, 200, 32756 (varies)</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">BLKSIZE</td>
                <td>Block size (0 = system optimal)</td>
                <td>0, 27998, 32760</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">DSORG</td>
                <td>Data set organization</td>
                <td>PS, PO, DA, VS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3">RECFM Values</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">F</code> - Fixed length unblocked</li>
              <li><code className="code-inline">FB</code> - Fixed length blocked</li>
              <li><code className="code-inline">V</code> - Variable length unblocked</li>
              <li><code className="code-inline">VB</code> - Variable length blocked</li>
              <li><code className="code-inline">A</code> - ASA carriage control</li>
              <li><code className="code-inline">M</code> - Machine carriage control</li>
              <li><code className="code-inline">U</code> - Undefined length</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3">BLKSIZE Best Practices</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Use <code className="code-inline">BLKSIZE=0</code> for system-optimized</li>
              <li>• For FB: BLKSIZE should be multiple of LRECL</li>
              <li>• Max efficient: 27998 (half-track blocking)</li>
              <li>• For VB: BLKSIZE = max LRECL + 4</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SPACE Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">SPACE Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">SPACE</code> parameter allocates disk space for new data sets. 
          Proper space allocation is crucial for job completion and efficient resource usage.
        </p>

        <FlowDiagram chart={spaceDiagram} title="SPACE Parameter Structure" />

        <CodeBlock
          title="SPACE Examples"
          code={`//* Cylinder allocation with release
//OUTPUT   DD DSN=BANK.TRANS.SORTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50),RLSE)
//
//* Track allocation for small files
//SMALL    DD DSN=BANK.CONTROL.PARMS,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(5,2))
//
//* Block size allocation
//BLKALLOC DD SPACE=(27800,(1000,500),RLSE)
//
//* PDS allocation (with directory blocks)
//PDSFILE  DD DSN=BANK.PDS.LIBRARY,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5,50)),
//            DCB=(RECFM=FB,LRECL=80,BLKSIZE=27920,DSORG=PO)
//
//* PDSE allocation
//PDSE     DD DSN=BANK.PDSE.LIBRARY,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5)),
//            DSNTYPE=LIBRARY
//
//* Contiguous allocation
//CONTIG   DD SPACE=(CYL,(50),CONTIG,RLSE)
//
//* Round to cylinder boundary
//ROUND    DD SPACE=(27800,(1000,500),RLSE,ROUND)`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">Space Calculation Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-mainframe-amber font-semibold mb-2">Cylinder vs Track</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• 1 CYL = 15 TRK (3390 disk)</li>
                <li>• 1 TRK ≈ 56,664 bytes</li>
                <li>• 1 CYL ≈ 849,960 bytes</li>
                <li>• Use CYL for large files</li>
                <li>• Use TRK for small files</li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent-cyan font-semibold mb-2">Space Options</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><code className="code-inline">RLSE</code> - Release unused space</li>
                <li><code className="code-inline">CONTIG</code> - Contiguous allocation</li>
                <li><code className="code-inline">ROUND</code> - Round to cylinder</li>
                <li><code className="code-inline">MXIG</code> - Max contiguous extent</li>
                <li><code className="code-inline">ALX</code> - Up to 5 extents</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special DD Statements */}
      <section className="space-y-6">
        <h2 className="section-title">Special DD Statements</h2>

        <CodeBlock
          title="Special DD Types"
          code={`//* SYSOUT - Output to JES spool
//SYSPRINT DD SYSOUT=*           Default output class
//REPORT   DD SYSOUT=A           Specific output class
//SUMMARY  DD SYSOUT=(A,RPTFORM) With form name

//* DUMMY - No actual I/O performed
//OPTIONAL DD DUMMY              Null file
//DUMMY    DD DUMMY,DCB=(RECFM=FB,LRECL=80)

//* Instream data (SYSIN)
//SYSIN    DD *
CONTROL CARD DATA LINE 1
CONTROL CARD DATA LINE 2
/*

//* Instream with delimiter
//SYSIN    DD DATA,DLM=@@
JCL STATEMENTS AS DATA
//THIS LOOKS LIKE JCL BUT ISN'T
@@

//* Concatenation
//INPUT    DD DSN=FILE1,DISP=SHR
//         DD DSN=FILE2,DISP=SHR
//         DD DSN=FILE3,DISP=SHR

//* Override with NULLFILE
//OPTIONAL DD NULLFILE`}
          language="jcl"
        />

        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4 flex gap-3">
          <Info className="text-accent-cyan flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-cyan font-semibold mb-1">Financial Use Cases</h4>
            <p className="text-gray-300 text-sm">
              Concatenated DD statements are commonly used to process multiple input files in sequence,
              such as combining branch transaction files for central processing. DUMMY DD statements
              allow conditional file processing without code changes.
            </p>
          </div>
        </div>
      </section>

      {/* UNIT and VOL Parameters */}
      <section className="space-y-6">
        <h2 className="section-title">UNIT and VOL Parameters</h2>

        <CodeBlock
          title="UNIT and VOL Examples"
          code={`//* UNIT - Device specification
//OUTPUT   DD DSN=BANK.TRANS.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            UNIT=SYSDA,              Standard DASD
//            SPACE=(CYL,(50,25))

//* Specific volume
//OUTPUT   DD DSN=BANK.TRANS.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            UNIT=3390,
//            VOL=SER=PROD01,
//            SPACE=(CYL,(50,25))

//* SMS-managed (modern z/OS)
//OUTPUT   DD DSN=BANK.TRANS.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            STORCLAS=STANDARD,
//            MGMTCLAS=DAILY,
//            DATACLAS=LARGE

//* Tape output
//TAPE     DD DSN=BANK.BACKUP.DATA,
//            DISP=(NEW,CATLG),
//            UNIT=TAPE,
//            VOL=SER=BKUP01,
//            DCB=(RECFM=FB,LRECL=200,BLKSIZE=32760)

//* Multi-volume
//MULTI    DD DSN=BANK.LARGE.FILE,
//            DISP=(NEW,CATLG),
//            UNIT=(SYSDA,2),
//            VOL=SER=(VOL001,VOL002),
//            SPACE=(CYL,(500,100))`}
          language="jcl"
        />
      </section>

      {/* Complete Example */}
      <section className="space-y-6">
        <h2 className="section-title">Complete Financial Example</h2>

        <CodeBlock
          title="Account Processing Job with Full DD Specifications"
          code={`//ACCTPROC JOB (FIN,ACCT),'ACCOUNT PROCESSING',
//             CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID
//*
//****************************************************************
//*  DAILY ACCOUNT TRANSACTION PROCESSING
//*  INPUT:  Daily transaction file (GDG)
//*  OUTPUT: Updated master file, error report
//****************************************************************
//*
//STEP010  EXEC PGM=ACCTUPD
//*
//* Input: Daily transactions (current GDG)
//TRANSIN  DD DSN=PROD.ACCT.TRANS.DAILY(0),
//            DISP=SHR
//*
//* Input: Account master file (exclusive for update)
//MASTER   DD DSN=PROD.ACCT.MASTER.FILE,
//            DISP=OLD
//*
//* Output: Updated accounts
//ACCTOUT  DD DSN=PROD.ACCT.UPDATED.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(200,50),RLSE),
//            DCB=(RECFM=FB,LRECL=500,BLKSIZE=0)
//*
//* Output: Transaction errors
//ERRORS   DD DSN=PROD.ACCT.TRANS.ERRORS,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5),RLSE),
//            DCB=(RECFM=FB,LRECL=200,BLKSIZE=0)
//*
//* Reports
//SUMMARY  DD SYSOUT=*,DCB=(RECFM=FBA,LRECL=133)
//DETAIL   DD SYSOUT=*,DCB=(RECFM=FBA,LRECL=133)
//*
//* Control cards
//SYSIN    DD *
  PROCESS=DAILY
  VALIDATE=YES
  AUDIT=FULL
/*
//SYSPRINT DD SYSOUT=*
//`}
          language="jcl"
        />
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/1"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 1: Fundamentals</span>
        </Link>
        <Link
          to="/module/3"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 3: EXEC Statement
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

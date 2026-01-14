import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module1_Fundamentals() {
  const jobStatementDiagram = `
flowchart TD
    A[JOB Statement] --> B[Job Name]
    A --> C[Accounting Info]
    A --> D[Programmer Name]
    A --> E[Keyword Parameters]
    
    E --> F[CLASS]
    E --> G[MSGCLASS]
    E --> H[MSGLEVEL]
    E --> I[NOTIFY]
    E --> J[TIME]
    E --> K[REGION]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style C fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style D fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style E fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
`

  const jclFlowDiagram = `
flowchart LR
    A[Submit JCL] --> B[JES2/JES3]
    B --> C{Syntax Check}
    C -->|Valid| D[Job Queue]
    C -->|Error| E[JCL Error]
    D --> F[Initiator]
    F --> G[Execute Steps]
    G --> H[Output Queue]
    H --> I[SYSOUT Processing]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style C fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style D fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style G fill:#1a1a2e,stroke:#00ff88,color:#00ff88
`

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-mainframe-amber">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-mainframe-amber">Module 1</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-mainframe-amber/10 flex items-center justify-center border border-mainframe-amber/30">
            <BookOpen className="text-mainframe-amber" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">JCL Fundamentals</h1>
            <p className="text-gray-400 mt-1">Master the JOB statement, syntax rules, and job structure</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">What is JCL?</h2>
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-mainframe-amber">Job Control Language (JCL)</strong> is the command language 
          used on IBM mainframe operating systems (z/OS, OS/390, MVS) to communicate with the system. JCL tells 
          the operating system what program to run, what files to use, and how to handle the results.
        </p>
        <p className="text-gray-300 leading-relaxed">
          In a financial institution, JCL is the backbone of batch processing—running everything from 
          nightly account reconciliation to monthly statement generation. Understanding JCL is essential 
          for anyone working with mainframe systems in banking, insurance, or financial services.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-mainframe-terminal p-4 rounded-lg border border-mainframe-amber/20">
            <h4 className="text-mainframe-amber font-semibold mb-2">JOB Statement</h4>
            <p className="text-gray-400 text-sm">Identifies the job and provides accounting information</p>
          </div>
          <div className="bg-mainframe-terminal p-4 rounded-lg border border-mainframe-green/20">
            <h4 className="text-mainframe-green font-semibold mb-2">EXEC Statement</h4>
            <p className="text-gray-400 text-sm">Specifies which program or procedure to execute</p>
          </div>
          <div className="bg-mainframe-terminal p-4 rounded-lg border border-accent-cyan/20">
            <h4 className="text-accent-cyan font-semibold mb-2">DD Statement</h4>
            <p className="text-gray-400 text-sm">Defines the data sets used by the program</p>
          </div>
        </div>
      </section>

      {/* JCL Statement Structure */}
      <section className="space-y-6">
        <h2 className="section-title">JCL Statement Structure</h2>
        
        <p className="text-gray-300 leading-relaxed">
          Every JCL statement follows a specific format with defined columns and fields:
        </p>

        <CodeBlock
          title="JCL Statement Format"
          code={`//NAME     OPERATION PARAMETERS   COMMENTS
//         |         |            |
//         Col 1-8   Col 10+      After parameters
//
// Example:
//STEP01   EXEC      PGM=IEFBR14  CREATE DUMMY STEP`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">Column Rules</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Content</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">Columns 1-2</td>
                <td><code className="code-inline">//</code></td>
                <td>Required identifier for JCL statements</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Columns 3-10</td>
                <td>Name Field</td>
                <td>Optional name (1-8 alphanumeric chars, starts with letter)</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Column 11+</td>
                <td>Operation</td>
                <td>JOB, EXEC, DD, or other operation</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">After Operation</td>
                <td>Parameters</td>
                <td>Positional and keyword parameters</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Column 72</td>
                <td>Continuation</td>
                <td>Non-blank character indicates continuation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* JOB Statement */}
      <section className="space-y-6">
        <h2 className="section-title">The JOB Statement</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">JOB</code> statement is the first statement in any job and 
          identifies the job to the system. It provides accounting information, job identification, and 
          execution parameters.
        </p>

        <FlowDiagram chart={jobStatementDiagram} title="JOB Statement Components" />

        <CodeBlock
          title="Basic JOB Statement"
          code={`//BANKJOB1 JOB (ACCT123,DEPT45),'JOHN DOE',
//             CLASS=A,
//             MSGCLASS=X,
//             MSGLEVEL=(1,1),
//             NOTIFY=&SYSUID,
//             TIME=(5,30),
//             REGION=0M`}
          language="jcl"
          highlightLines={[1]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-amber font-semibold mb-3">Positional Parameters</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><span className="text-mainframe-green">Accounting Info:</span> (ACCT123,DEPT45) - for billing</li>
              <li><span className="text-mainframe-green">Programmer Name:</span> 'JOHN DOE' - identifies submitter</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3">Keyword Parameters</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><span className="text-mainframe-amber">CLASS:</span> Job execution class</li>
              <li><span className="text-mainframe-amber">MSGCLASS:</span> Output message class</li>
              <li><span className="text-mainframe-amber">NOTIFY:</span> TSO user to notify</li>
            </ul>
          </div>
        </div>

        <div className="card-highlight">
          <h3 className="subsection-title">Common JOB Parameters</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Purpose</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">CLASS</td>
                <td>Assigns job to execution class (initiator)</td>
                <td><code>CLASS=A</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">MSGCLASS</td>
                <td>Directs JES messages output</td>
                <td><code>MSGCLASS=X</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">MSGLEVEL</td>
                <td>Controls JCL/allocation messages</td>
                <td><code>MSGLEVEL=(1,1)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">NOTIFY</td>
                <td>TSO user notification</td>
                <td><code>NOTIFY=&SYSUID</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">TIME</td>
                <td>CPU time limit (minutes,seconds)</td>
                <td><code>TIME=(10,30)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">REGION</td>
                <td>Memory allocation</td>
                <td><code>REGION=256M</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">TYPRUN</td>
                <td>Special job processing</td>
                <td><code>TYPRUN=SCAN</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">RESTART</td>
                <td>Restart from specific step</td>
                <td><code>RESTART=STEP03</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Job Flow */}
      <section className="space-y-6">
        <h2 className="section-title">JCL Processing Flow</h2>
        
        <p className="text-gray-300 leading-relaxed">
          Understanding how JCL is processed helps you debug issues and optimize job execution:
        </p>

        <FlowDiagram chart={jclFlowDiagram} title="JCL Processing Flow" />

        <div className="card-dark">
          <h3 className="subsection-title">Processing Phases</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-mainframe-amber/20 text-mainframe-amber flex items-center justify-center font-mono text-sm flex-shrink-0">1</span>
              <div>
                <h4 className="text-white font-semibold">Submission</h4>
                <p className="text-gray-400 text-sm">JCL is submitted via TSO, batch, or automation tool</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-mainframe-amber/20 text-mainframe-amber flex items-center justify-center font-mono text-sm flex-shrink-0">2</span>
              <div>
                <h4 className="text-white font-semibold">JES Processing</h4>
                <p className="text-gray-400 text-sm">JES2/JES3 receives and validates syntax</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-mainframe-amber/20 text-mainframe-amber flex items-center justify-center font-mono text-sm flex-shrink-0">3</span>
              <div>
                <h4 className="text-white font-semibold">Conversion</h4>
                <p className="text-gray-400 text-sm">JCL converted to internal format, placed in queue</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-mainframe-amber/20 text-mainframe-amber flex items-center justify-center font-mono text-sm flex-shrink-0">4</span>
              <div>
                <h4 className="text-white font-semibold">Execution</h4>
                <p className="text-gray-400 text-sm">Initiator selects job and executes each step</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-mainframe-amber/20 text-mainframe-amber flex items-center justify-center font-mono text-sm flex-shrink-0">5</span>
              <div>
                <h4 className="text-white font-semibold">Output Processing</h4>
                <p className="text-gray-400 text-sm">SYSOUT data sets sent to output queue for printing</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Comments and Delimiters */}
      <section className="space-y-6">
        <h2 className="section-title">Comments and Special Statements</h2>

        <CodeBlock
          title="Comment Statements"
          code={`//*********************************************
//*  DAILY ACCOUNT RECONCILIATION JOB
//*  AUTHOR: OPERATIONS TEAM
//*  DATE:   2024-01-15
//*********************************************
//RECONJOB JOB (ACCT),'RECON DAILY'
//*
//* STEP 1: EXTRACT TRANSACTIONS
//*
//STEP010  EXEC PGM=EXTRACT
/*
// THIS IS A NULL STATEMENT (ENDS INSTREAM DATA)`}
          language="jcl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Comment Best Practices
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Document job purpose and owner</li>
              <li>• Explain complex logic or unusual parameters</li>
              <li>• Include change history</li>
              <li>• Mark sections with visual separators</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-orange font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} />
              Special Delimiters
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">//*</code> - Comment line</li>
              <li><code className="code-inline">/*</code> - End of instream data</li>
              <li><code className="code-inline">//</code> - Null statement</li>
              <li><code className="code-inline">//name SET</code> - Set symbolic</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Complete Job Example */}
      <section className="space-y-6">
        <h2 className="section-title">Complete JCL Job Example</h2>
        
        <p className="text-gray-300 leading-relaxed">
          Here's a complete JCL job that demonstrates all fundamental components:
        </p>

        <CodeBlock
          title="Complete Financial Batch Job"
          code={`//FINJOB01 JOB (FINOPS,1234),'DAILY TRANS PROC',
//             CLASS=A,
//             MSGCLASS=H,
//             MSGLEVEL=(1,1),
//             NOTIFY=&SYSUID,
//             TIME=(30,0),
//             REGION=0M
//*
//**********************************************************
//*  DAILY TRANSACTION PROCESSING JOB
//*  RUNS: EVERY BUSINESS DAY AT 18:00
//*  OWNER: FINANCIAL OPERATIONS TEAM
//**********************************************************
//*
//* STEP 1 - SORT DAILY TRANSACTIONS BY ACCOUNT NUMBER
//*
//STEP010  EXEC PGM=SORT
//SORTIN   DD DSN=FIN.TRANS.DAILY.INPUT,DISP=SHR
//SORTOUT  DD DSN=FIN.TRANS.DAILY.SORTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE),
//            DCB=(RECFM=FB,LRECL=200,BLKSIZE=0)
//SYSOUT   DD SYSOUT=*
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)
/*
//*
//* STEP 2 - PROCESS SORTED TRANSACTIONS
//*
//STEP020  EXEC PGM=TRANPROC,COND=(0,NE)
//INFILE   DD DSN=FIN.TRANS.DAILY.SORTED,DISP=SHR
//OUTFILE  DD DSN=FIN.TRANS.DAILY.POSTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50),RLSE),
//            DCB=(RECFM=FB,LRECL=200,BLKSIZE=0)
//ERRFILE  DD DSN=FIN.TRANS.DAILY.ERRORS,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(10,5),RLSE)
//REPORT   DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//*
//* STEP 3 - GENERATE SUMMARY REPORT
//*
//STEP030  EXEC PGM=RPTGEN,COND=(4,LT)
//INPUT    DD DSN=FIN.TRANS.DAILY.POSTED,DISP=SHR
//REPORT   DD SYSOUT=*,DCB=(RECFM=FBA,LRECL=133)
//`}
          language="jcl"
        />
      </section>

      {/* Key Takeaways */}
      <section className="card-highlight">
        <h2 className="section-title">Key Takeaways</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-mainframe-green font-semibold mb-3">Remember</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Every job starts with a JOB statement</li>
              <li>✓ Columns 1-2 must contain //</li>
              <li>✓ Names are 1-8 characters, start with letter</li>
              <li>✓ Use comments liberally for documentation</li>
              <li>✓ CLASS determines which initiator runs the job</li>
            </ul>
          </div>
          <div>
            <h4 className="text-accent-orange font-semibold mb-3">Common Mistakes</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✗ Forgetting continuation in column 72</li>
              <li>✗ Misspelling parameter names</li>
              <li>✗ Using lowercase (JCL is case-sensitive)</li>
              <li>✗ Missing commas between parameters</li>
              <li>✗ Exceeding column 71 on continued lines</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/module/2"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 2: DD Statements
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

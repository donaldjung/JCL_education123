import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, FolderCog, Info, CheckCircle2 } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module4_Procedures() {
  const procFlowDiagram = `
flowchart LR
    A[JCL Job] --> B[EXEC PROC=name]
    B --> C[JES Retrieves PROC]
    C --> D[Merge Overrides]
    D --> E[Execute Expanded JCL]
    
    F[PROC Library] --> C
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style C fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style E fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style F fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
`

  const symbolicDiagram = `
flowchart TD
    A[Symbolic Parameter] --> B[Definition in PROC]
    B --> C[&SYMBOL or &SYMBOL=default]
    
    A --> D[Override in JCL]
    D --> E[SYMBOL=value on EXEC]
    
    C --> F[Substitution]
    E --> F
    F --> G[Expanded JCL]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style D fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
`

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-mainframe-amber">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-mainframe-amber">Module 4</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent-orange/10 flex items-center justify-center border border-accent-orange/30">
            <FolderCog className="text-accent-orange" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Procedures (PROCs)</h1>
            <p className="text-gray-400 mt-1">Cataloged and in-stream PROCs, symbolic parameters, and overrides</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">What are JCL Procedures?</h2>
        <p className="text-gray-300 leading-relaxed">
          A <strong className="text-accent-orange">procedure (PROC)</strong> is a set of JCL statements 
          stored in a library that can be invoked by name. Procedures promote code reuse, standardization, 
          and easier maintenance. In financial institutions, PROCs ensure consistent execution of critical 
          batch processes.
        </p>
        <p className="text-gray-300 leading-relaxed">
          PROCs contain <strong>symbolic parameters</strong> that can be customized at execution time, 
          making them flexible for different environments (DEV, TEST, PROD) and varying input requirements.
        </p>
        
        <FlowDiagram chart={procFlowDiagram} title="PROC Invocation Flow" />
      </section>

      {/* Types of PROCs */}
      <section className="space-y-6">
        <h2 className="section-title">Types of Procedures</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-highlight">
            <h4 className="text-mainframe-amber font-semibold mb-3">Cataloged Procedures</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Stored in system PROCLIB (SYS1.PROCLIB)</li>
              <li>• Or custom procedure libraries</li>
              <li>• Available to all jobs</li>
              <li>• Centrally maintained</li>
              <li>• Version controlled</li>
            </ul>
          </div>
          
          <div className="card-highlight">
            <h4 className="text-accent-cyan font-semibold mb-3">In-Stream Procedures</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Coded within the job JCL</li>
              <li>• Between PROC and PEND statements</li>
              <li>• Local to that job only</li>
              <li>• Good for testing/development</li>
              <li>• Self-contained jobs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* In-Stream Procedures */}
      <section className="space-y-6">
        <h2 className="section-title">In-Stream Procedures</h2>

        <CodeBlock
          title="In-Stream PROC Definition"
          code={`//TESTJOB  JOB (ACCT),'TEST PROC',CLASS=A
//*
//**  IN-STREAM PROCEDURE DEFINITION
//*
//SORTPROC PROC SORTIN=,SORTOUT=,SORTFLDS=
//*
//SORT     EXEC PGM=SORT
//SORTIN   DD DSN=&SORTIN,DISP=SHR
//SORTOUT  DD DSN=&SORTOUT,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE)
//SYSOUT   DD SYSOUT=*
//SYSIN    DD *
  SORT FIELDS=&SORTFLDS
/*
//         PEND
//*
//**  INVOKE THE PROCEDURE
//*
//STEP01   EXEC SORTPROC,
//             SORTIN='BANK.TRANS.INPUT',
//             SORTOUT='BANK.TRANS.SORTED',
//             SORTFLDS='(1,10,CH,A)'
//*
//STEP02   EXEC SORTPROC,
//             SORTIN='BANK.ACCOUNTS.INPUT',
//             SORTOUT='BANK.ACCOUNTS.SORTED',
//             SORTFLDS='(1,15,CH,A,16,8,PD,D)'`}
          language="jcl"
        />

        <div className="card-dark">
          <h3 className="subsection-title">In-Stream PROC Rules</h3>
          <ul className="space-y-2 text-gray-300">
            <li><code className="code-inline">//name PROC</code> - Starts procedure definition</li>
            <li><code className="code-inline">//     PEND</code> - Ends procedure definition</li>
            <li>• Must appear before first EXEC statement</li>
            <li>• Can define multiple in-stream PROCs</li>
            <li>• Symbolic parameters defined on PROC statement</li>
          </ul>
        </div>
      </section>

      {/* Cataloged Procedures */}
      <section className="space-y-6">
        <h2 className="section-title">Cataloged Procedures</h2>

        <CodeBlock
          title="Cataloged PROC (in PROCLIB)"
          code={`//*****************************************************************
//*  PROC: TRANSACT
//*  DESC: Standard Transaction Processing Procedure
//*  PARM: &ENV     - Environment (PROD/TEST/DEV)
//*        &INFILE  - Input transaction file
//*        &OUTFILE - Output processed file
//*        &REGION  - Region size (default 256M)
//*****************************************************************
//TRANSACT PROC ENV=PROD,
//             INFILE=,
//             OUTFILE=,
//             REGION=256M
//*
//* STEP 1: VALIDATE TRANSACTIONS
//*
//VALIDATE EXEC PGM=VALIPROG,REGION=&REGION
//STEPLIB  DD DSN=&ENV..LOADLIB,DISP=SHR
//INPUT    DD DSN=&INFILE,DISP=SHR
//VALID    DD DSN=&&VALID,DISP=(NEW,PASS),
//            SPACE=(CYL,(10,5))
//INVALID  DD DSN=&ENV..TRANS.INVALID,
//            DISP=(MOD,CATLG)
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: PROCESS VALID TRANSACTIONS
//*
//PROCESS  EXEC PGM=PROCPROG,REGION=&REGION,
//             COND=(4,LT,VALIDATE)
//STEPLIB  DD DSN=&ENV..LOADLIB,DISP=SHR
//INPUT    DD DSN=*.VALIDATE.VALID,DISP=(OLD,DELETE)
//OUTPUT   DD DSN=&OUTFILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE)
//SYSPRINT DD SYSOUT=*
//*`}
          language="jcl"
        />

        <CodeBlock
          title="Invoking Cataloged PROC"
          code={`//DAILYJOB JOB (FIN,DAILY),'DAILY TRANS',CLASS=A
//*
//* SPECIFY PROC LIBRARIES
//*
//MYLIB    JCLLIB ORDER=(PROD.PROC.LIBRARY,
//                       SYS1.PROCLIB)
//*
//* EXECUTE CATALOGED PROC WITH OVERRIDES
//*
//STEP01   EXEC TRANSACT,
//             ENV=PROD,
//             INFILE='PROD.TRANS.DAILY.INPUT',
//             OUTFILE='PROD.TRANS.DAILY.OUTPUT',
//             REGION=512M`}
          language="jcl"
        />
      </section>

      {/* Symbolic Parameters */}
      <section className="space-y-6">
        <h2 className="section-title">Symbolic Parameters</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-mainframe-green">Symbolic parameters</strong> are placeholders in PROCs 
          that are replaced with actual values at execution time. They make procedures flexible and reusable.
        </p>

        <FlowDiagram chart={symbolicDiagram} title="Symbolic Parameter Substitution" />

        <CodeBlock
          title="Symbolic Parameter Syntax"
          code={`//* In PROC definition:
//MYPROC   PROC DATASET=,             Required - no default
//              REGION=256M,          Optional with default
//              DATE=&LYYMMDD         System symbolic
//*
//* Using symbolics:
//STEP01   EXEC PGM=MYPROG,REGION=&REGION
//INPUT    DD DSN=&DATASET,DISP=SHR
//OUTPUT   DD DSN=BACKUP.&DATE,DISP=(NEW,CATLG)
//*
//* System Symbolics (set by system):
//* &SYSUID   - TSO user ID
//* &LYYMMDD  - Current date (YYMMDD)
//* &LHHMMSS  - Current time
//* &SYSNAME  - System name
//* &SYSPLEX  - Sysplex name
//*
//* SET statement for complex symbolics:
//         SET CYCLE='01'
//         SET FILEDATE=&LYYMMDD
//INPUT    DD DSN=DAILY.DATA.C&CYCLE.D&FILEDATE,DISP=SHR`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">Symbolic Parameter Rules</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">Naming</td>
                <td>1-8 chars, start with letter</td>
                <td><code>&INFILE</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Delimiter</td>
                <td>Use period to end symbolic</td>
                <td><code>&ENV..LOADLIB</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Defaults</td>
                <td>Specified on PROC statement</td>
                <td><code>REGION=256M</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Required</td>
                <td>No default = must override</td>
                <td><code>INFILE=</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Nullify</td>
                <td>Empty value to clear</td>
                <td><code>PARM=</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Overriding PROCs */}
      <section className="space-y-6">
        <h2 className="section-title">Overriding Procedure Statements</h2>

        <CodeBlock
          title="Override Examples"
          code={`//PRODJOB  JOB (ACCT),'PROD RUN',CLASS=A
//*
//STEP01   EXEC TRANSACT,ENV=PROD,INFILE='PROD.DATA'
//*
//* OVERRIDE DD STATEMENT IN PROC
//* Format: //procstep.ddname DD override-params
//*
//VALIDATE.SYSPRINT DD SYSOUT=A      Override SYSOUT class
//VALIDATE.STEPLIB DD                 Override entire STEPLIB
//                 DD DSN=PROD.NEW.LOADLIB,DISP=SHR
//                 DD DSN=PROD.OLD.LOADLIB,DISP=SHR
//*
//* ADD NEW DD STATEMENT (not in PROC)
//PROCESS.DEBUG DD SYSOUT=*
//*
//* OVERRIDE EXEC PARAMETERS
//STEP02   EXEC TRANSACT,
//             REGION.VALIDATE=512M,   Override step REGION
//             PARM.PROCESS='DEBUG'    Override step PARM
//*
//* NULLIFY A DD STATEMENT
//PROCESS.OPTIONAL DD DUMMY`}
          language="jcl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Override Best Practices
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Document overrides clearly</li>
              <li>• Use symbolics instead of overrides when possible</li>
              <li>• Keep overrides minimal</li>
              <li>• Test thoroughly in non-prod</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3 flex items-center gap-2">
              <Info size={18} />
              Override Order
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>1. EXEC overrides (symbolics)</li>
              <li>2. DD overrides by stepname.ddname</li>
              <li>3. DD additions</li>
              <li>4. Must follow PROC step order</li>
            </ul>
          </div>
        </div>
      </section>

      {/* JCLLIB Statement */}
      <section className="space-y-6">
        <h2 className="section-title">JCLLIB and INCLUDE</h2>

        <CodeBlock
          title="JCLLIB and INCLUDE Statements"
          code={`//MYJOB    JOB (ACCT),'MY JOB',CLASS=A
//*
//* JCLLIB - Specify PROC library search order
//* Must be first statement after JOB (except comments)
//*
//MYLIBS   JCLLIB ORDER=(PROD.USER.PROCLIB,
//                       PROD.COMMON.PROCLIB,
//                       SYS1.PROCLIB)
//*
//* INCLUDE - Insert JCL from a member
//*
//         INCLUDE MEMBER=STDALLOC      Include allocations
//*
//STEP01   EXEC DAILYPROC
//*
//* Include can be used anywhere in JCL
//         INCLUDE MEMBER=CLEANUP
//*
//**********************************************************
//* The INCLUDE member (PROD.USER.PROCLIB(STDALLOC)):
//**********************************************************
//* //SYSPRINT DD SYSOUT=*
//* //SYSOUT   DD SYSOUT=*
//* //SYSUDUMP DD SYSOUT=*`}
          language="jcl"
        />
      </section>

      {/* Financial PROC Example */}
      <section className="space-y-6">
        <h2 className="section-title">Financial Institution PROC Example</h2>

        <CodeBlock
          title="End-of-Day Processing PROC"
          code={`//*****************************************************************
//*  PROC: EODPROC
//*  DESC: End-of-Day Financial Processing Procedure
//*  OWNER: Financial Operations Team
//*  
//*  PARAMETERS:
//*    &ENV     - Environment (PROD/TEST)
//*    &BUSDATE - Business date (YYYYMMDD)
//*    &REGION  - Region code (ALL/EAST/WEST/CENTRAL)
//*****************************************************************
//EODPROC  PROC ENV=PROD,
//              BUSDATE=,
//              REGION=ALL
//*
//* STEP 1: EXTRACT DAILY TRANSACTIONS
//*
//EXTRACT  EXEC PGM=EODEXT01,REGION=512M
//STEPLIB  DD DSN=&ENV..FIN.LOADLIB,DISP=SHR
//TRANIN   DD DSN=&ENV..TRANS.DAILY,DISP=SHR
//ACCTMSTR DD DSN=&ENV..ACCT.MASTER,DISP=SHR
//EXTRACT  DD DSN=&ENV..EOD.EXTRACT.D&BUSDATE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(500,100),RLSE),
//            DCB=(RECFM=FB,LRECL=500)
//PARMFILE DD *
  REGION=&REGION
  DATE=&BUSDATE
/*
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: VALIDATE AND BALANCE
//*
//BALANCE  EXEC PGM=EODBAL01,REGION=256M,
//             COND=(4,LT,EXTRACT)
//STEPLIB  DD DSN=&ENV..FIN.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.EXTRACT.EXTRACT,DISP=SHR
//CONTROL  DD DSN=&ENV..EOD.CONTROLS.D&BUSDATE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(10,5))
//SYSPRINT DD SYSOUT=*
//BALRPT   DD SYSOUT=*
//*
//* STEP 3: POST TO GENERAL LEDGER
//*
//GLPOST   EXEC PGM=EODGL01,REGION=1G,
//             COND=(0,NE,BALANCE)
//STEPLIB  DD DSN=&ENV..FIN.LOADLIB,DISP=SHR
//EXTRACT  DD DSN=*.EXTRACT.EXTRACT,DISP=SHR
//GLMASTER DD DSN=&ENV..GL.MASTER,DISP=OLD
//GLHIST   DD DSN=&ENV..GL.HISTORY(+1),
//            DISP=(NEW,CATLG),
//            SPACE=(CYL,(100,50))
//SYSPRINT DD SYSOUT=*
//GLRPT    DD SYSOUT=A
//*
//* STEP 4: GENERATE EOD REPORTS
//*
//REPORTS  EXEC PGM=EODRPT01,
//             COND=(4,LT)
//STEPLIB  DD DSN=&ENV..FIN.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.EXTRACT.EXTRACT,DISP=SHR
//SUMMARY  DD SYSOUT=A
//DETAIL   DD SYSOUT=A
//EXCEPT   DD SYSOUT=*
//*`}
          language="jcl"
        />

        <CodeBlock
          title="Invoking the EOD PROC"
          code={`//EODPROD  JOB (FINOPS,EOD),'EOD PROCESSING',
//             CLASS=A,MSGCLASS=H,
//             NOTIFY=&SYSUID,
//             TIME=1440
//*
//LIBS     JCLLIB ORDER=(PROD.FIN.PROCLIB)
//*
//* EXECUTE EOD PROCESSING FOR ALL REGIONS
//*
//ALLEOD   EXEC EODPROC,
//             ENV=PROD,
//             BUSDATE=20240115,
//             REGION=ALL
//*
//* OVERRIDE: Send GL report to special class
//GLPOST.GLRPT DD SYSOUT=G
//*
//* ADD: Debug output for this run
//EXTRACT.DEBUG DD SYSOUT=*`}
          language="jcl"
        />
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/3"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 3: EXEC Statement</span>
        </Link>
        <Link
          to="/module/5"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 5: VSAM & IDCAMS
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

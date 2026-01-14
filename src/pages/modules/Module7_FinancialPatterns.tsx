import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module7_FinancialPatterns() {
  const eodFlowDiagram = `
flowchart TD
    A[End of Day Start] --> B[Close Online Systems]
    B --> C[Extract Transactions]
    C --> D[Validate & Balance]
    D --> E{Balanced?}
    E -->|Yes| F[Post to Master Files]
    E -->|No| G[Error Recovery]
    G --> D
    F --> H[GL Interface]
    H --> I[Generate Reports]
    I --> J[Archive & Backup]
    J --> K[EOD Complete]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style E fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style F fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style G fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
    style K fill:#1a1a2e,stroke:#00ff88,color:#00ff88
`

  const batchWindowDiagram = `
flowchart LR
    A[6PM: Online Close] --> B[6PM-9PM: EOD Batch]
    B --> C[9PM-12AM: Month-End]
    C --> D[12AM-4AM: Backups]
    D --> E[4AM-6AM: Reports]
    E --> F[6AM: Online Start]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style C fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style D fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
`

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-mainframe-amber">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-mainframe-amber">Module 7</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/30">
            <Building2 className="text-accent-cyan" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Financial Institution JCL Patterns</h1>
            <p className="text-gray-400 mt-1">Real-world batch processing patterns for banking and finance</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">Financial Batch Processing</h2>
        <p className="text-gray-300 leading-relaxed">
          Financial institutions rely heavily on <strong className="text-accent-cyan">batch processing</strong> for 
          critical operations: end-of-day processing, account reconciliation, regulatory reporting, and 
          statement generation. These jobs must complete within strict time windows with zero tolerance 
          for data errors.
        </p>
        <p className="text-gray-300 leading-relaxed">
          This module covers real-world JCL patterns used in banks, insurance companies, and investment 
          firms. Understanding these patterns is essential for anyone supporting financial mainframe systems.
        </p>
        
        <FlowDiagram chart={batchWindowDiagram} title="Typical Banking Batch Window" />
      </section>

      {/* EOD Processing */}
      <section className="space-y-6">
        <h2 className="section-title">End-of-Day (EOD) Processing</h2>
        
        <p className="text-gray-300 leading-relaxed">
          End-of-Day processing is the most critical batch cycle in financial institutions. It 
          closes the business day, posts transactions, updates balances, and prepares systems for 
          the next business day.
        </p>

        <FlowDiagram chart={eodFlowDiagram} title="EOD Processing Flow" />

        <CodeBlock
          title="EOD Master Job"
          code={`//EODMSTR  JOB (PROD,EOD),'EOD PROCESSING',
//             CLASS=A,MSGCLASS=H,
//             NOTIFY=&SYSUID,
//             TIME=1440,
//             MSGLEVEL=(1,1)
//*
//PROCLIB  JCLLIB ORDER=(PROD.EOD.PROCLIB)
//*
//**********************************************************
//*  END OF DAY MASTER JOB
//*  EXECUTES ALL EOD PROCESSING STEPS
//*  BUSINESS DATE: &BUSDATE
//**********************************************************
//*
//* STEP 1: VERIFY ONLINE SYSTEMS CLOSED
//*
//VERIFY   EXEC PGM=EODVERFY,REGION=64M
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//STATUS   DD DSN=PROD.ONLINE.STATUS,DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  CHECK CICS=PRODCICS,STATUS=CLOSED
  CHECK DB2=PRODDB2,STATUS=QUIESCED
/*
//*
//* STEP 2: EXTRACT DAILY TRANSACTIONS
//*
//         IF (VERIFY.RC = 0) THEN
//EXTRACT  EXEC EODEXTR,ENV=PROD,BUSDATE=&BUSDATE
//         ENDIF
//*
//* STEP 3: VALIDATE AND BALANCE
//*
//         IF (EXTRACT.RC <= 4) THEN
//VALIDATE EXEC EODVAL,ENV=PROD,BUSDATE=&BUSDATE
//         ENDIF
//*
//* STEP 4: POST TO MASTER FILES
//*
//         IF (VALIDATE.RC = 0) THEN
//POST     EXEC EODPOST,ENV=PROD,BUSDATE=&BUSDATE
//         ELSE
//NOTIFY   EXEC PGM=EODNOTFY,PARM='ERROR IN VALIDATE'
//         ENDIF
//*
//* STEP 5: GL INTERFACE
//*
//         IF (POST.RC = 0) THEN
//GLINTF   EXEC EODGL,ENV=PROD,BUSDATE=&BUSDATE
//         ENDIF
//*
//* STEP 6: GENERATE EOD REPORTS
//*
//         IF (GLINTF.RC <= 4) THEN
//REPORTS  EXEC EODRPT,ENV=PROD,BUSDATE=&BUSDATE
//         ENDIF
//*
//* STEP 7: ARCHIVE AND BACKUP
//*
//ARCHIVE  EXEC EODARCH,ENV=PROD,BUSDATE=&BUSDATE,
//             COND=EVEN
//*`}
          language="jcl"
        />
      </section>

      {/* Transaction Processing */}
      <section className="space-y-6">
        <h2 className="section-title">Transaction Processing Pattern</h2>

        <CodeBlock
          title="Transaction Processing Job"
          code={`//TRANPROC JOB (PROD,TRANS),'TRANS PROCESSING',
//             CLASS=A,MSGCLASS=H,NOTIFY=&SYSUID
//*
//**********************************************************
//*  DAILY TRANSACTION PROCESSING
//*  INPUT:  BANK.TRANS.DAILY.INPUT
//*  OUTPUT: BANK.TRANS.DAILY.POSTED
//**********************************************************
//*
//* STEP 1: SORT TRANSACTIONS BY ACCOUNT
//*
//SORT     EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=BANK.TRANS.DAILY.INPUT,DISP=SHR
//SORTOUT  DD DSN=&&SORTED,DISP=(NEW,PASS),
//            SPACE=(CYL,(100,50),RLSE)
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A,11,8,PD,A)
  SUM FIELDS=NONE
/*
//*
//* STEP 2: VALIDATE TRANSACTIONS
//*
//VALIDATE EXEC PGM=TRANVAL,REGION=256M
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.SORT.SORTOUT,DISP=(OLD,DELETE)
//ACCOUNTS DD DSN=PROD.ACCT.MASTER,DISP=SHR
//VALID    DD DSN=&&VALID,DISP=(NEW,PASS),
//            SPACE=(CYL,(100,50))
//INVALID  DD DSN=BANK.TRANS.DAILY.REJECT,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5),RLSE)
//SYSPRINT DD SYSOUT=*
//*
//* STEP 3: POST VALID TRANSACTIONS
//*
//         IF (VALIDATE.RC <= 4) THEN
//POST     EXEC PGM=TRANPOST,REGION=512M
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.VALIDATE.VALID,DISP=(OLD,DELETE)
//MASTER   DD DSN=PROD.ACCT.MASTER,DISP=OLD
//POSTED   DD DSN=BANK.TRANS.DAILY.POSTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50),RLSE),
//            DCB=(RECFM=FB,LRECL=200)
//AUDIT    DD DSN=BANK.AUDIT.TRAIL(+1),
//            DISP=(NEW,CATLG),
//            SPACE=(CYL,(50,25))
//SYSPRINT DD SYSOUT=*
//         ENDIF
//*
//* STEP 4: GENERATE POSTING REPORT
//*
//REPORT   EXEC PGM=TRANRPT,COND=(8,LT)
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=BANK.TRANS.DAILY.POSTED,DISP=SHR
//SUMMARY  DD SYSOUT=A
//DETAIL   DD SYSOUT=A
//`}
          language="jcl"
        />
      </section>

      {/* GL Extract */}
      <section className="space-y-6">
        <h2 className="section-title">General Ledger (GL) Extract</h2>

        <CodeBlock
          title="GL Extract Job"
          code={`//GLEXTRACT JOB (PROD,GL),'GL EXTRACT',
//              CLASS=A,MSGCLASS=H,NOTIFY=&SYSUID
//*
//**********************************************************
//*  GENERAL LEDGER EXTRACT
//*  CREATES GL POSTING FILE FROM DAILY TRANSACTIONS
//**********************************************************
//*
//* STEP 1: EXTRACT GL ENTRIES FROM TRANSACTIONS
//*
//EXTRACT  EXEC PGM=GLEXT01
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//TRANS    DD DSN=BANK.TRANS.DAILY.POSTED,DISP=SHR
//GLCODES  DD DSN=PROD.GL.CODE.TABLE,DISP=SHR
//GLOUT    DD DSN=&&GLRAW,DISP=(NEW,PASS),
//            SPACE=(CYL,(200,50))
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: SUMMARIZE BY GL ACCOUNT
//*
//SUMMARY  EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=*.EXTRACT.GLOUT,DISP=(OLD,DELETE)
//SORTOUT  DD DSN=&&GLSUM,DISP=(NEW,PASS),
//            SPACE=(CYL,(50,25))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A,11,4,CH,A)
  SUM FIELDS=(21,8,PD,28,8,PD)
  OUTFIL FNAMES=SORTOUT,
         OUTREC=(1,20,21,8,PD,EDIT=(SIIIIIIIIIT.TT),
                 C' ',28,8,PD,EDIT=(SIIIIIIIIIT.TT))
/*
//*
//* STEP 3: CREATE GL INTERFACE FILE
//*
//GLINTF   EXEC PGM=GLINTF01
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.SUMMARY.SORTOUT,DISP=(OLD,DELETE)
//GLMASTER DD DSN=PROD.GL.MASTER,DISP=SHR
//GLPOST   DD DSN=BANK.GL.POSTING.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(20,10),RLSE),
//            DCB=(RECFM=FB,LRECL=150)
//BALRPT   DD SYSOUT=A
//SYSPRINT DD SYSOUT=*
//*
//* STEP 4: TRANSMIT TO GL SYSTEM
//*
//TRANSMIT EXEC PGM=FTP,PARM='(EXIT',
//             COND=(0,NE,GLINTF)
//SYSPRINT DD SYSOUT=*
//INPUT    DD *
OPEN GLSERVER.BANK.COM
USER GLBATCH
PUT 'BANK.GL.POSTING.FILE' 'GL/INBOUND/DAILY.TXT'
QUIT
/*
//`}
          language="jcl"
        />
      </section>

      {/* Statement Generation */}
      <section className="space-y-6">
        <h2 className="section-title">Statement Generation</h2>

        <CodeBlock
          title="Monthly Statement Job"
          code={`//STMTGEN  JOB (PROD,STMT),'MONTHLY STATEMENTS',
//             CLASS=A,MSGCLASS=H,
//             TIME=1440,NOTIFY=&SYSUID
//*
//**********************************************************
//*  MONTHLY CUSTOMER STATEMENT GENERATION
//*  RUN DATE: LAST BUSINESS DAY OF MONTH
//**********************************************************
//*
//* STEP 1: EXTRACT ACCOUNT DATA
//*
//EXTRACT  EXEC PGM=STMTEXT
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//ACCOUNTS DD DSN=PROD.ACCT.MASTER,DISP=SHR
//TRANS    DD DSN=BANK.TRANS.MONTHLY.HIST,DISP=SHR
//ADDRESS  DD DSN=PROD.CUSTOMER.ADDRESS,DISP=SHR
//OUTPUT   DD DSN=&&STMTDATA,DISP=(NEW,PASS),
//            SPACE=(CYL,(500,100))
//PARMS    DD *
  STMT_MONTH=202401
  INCLUDE_ZERO_BAL=NO
  SORT_BY=ZIPCODE
/*
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: SORT FOR PRINT OPTIMIZATION
//*
//SORT     EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=*.EXTRACT.OUTPUT,DISP=(OLD,DELETE)
//SORTOUT  DD DSN=&&SORTED,DISP=(NEW,PASS),
//            SPACE=(CYL,(500,100))
//SYSIN    DD *
  SORT FIELDS=(200,5,CH,A,1,10,CH,A)
/*
//*
//* STEP 3: GENERATE PDF STATEMENTS
//*
//GENPDF   EXEC PGM=STMTPDF,REGION=2G
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.SORT.SORTOUT,DISP=(OLD,DELETE)
//TEMPLATE DD DSN=PROD.STMT.TEMPLATE,DISP=SHR
//LOGO     DD DSN=PROD.BANK.LOGO,DISP=SHR
//PDFOUT   DD DSN=BANK.STMT.PDF.MONTHLY,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(1000,200),RLSE)
//CONTROL  DD DSN=BANK.STMT.CONTROL.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5))
//SYSPRINT DD SYSOUT=*
//STATS    DD SYSOUT=*
//*
//* STEP 4: TRANSMIT TO PRINT VENDOR
//*
//XMIT     EXEC PGM=FTP,COND=(4,LT)
//SYSPRINT DD SYSOUT=*
//INPUT    DD *
OPEN PRINTVENDOR.COM
USER BANKSTMT
BINARY
MPUT 'BANK.STMT.PDF.MONTHLY' 'BANK/MONTHLY/*.PDF'
QUIT
/*
//`}
          language="jcl"
        />
      </section>

      {/* Regulatory Reporting */}
      <section className="space-y-6">
        <h2 className="section-title">Regulatory Reporting</h2>

        <CodeBlock
          title="Regulatory Report Generation"
          code={`//REGRPT   JOB (PROD,REG),'REGULATORY REPORTS',
//             CLASS=A,MSGCLASS=H,NOTIFY=&SYSUID
//*
//**********************************************************
//*  REGULATORY REPORT GENERATION
//*  CTR - Currency Transaction Report (FinCEN)
//*  SAR - Suspicious Activity Report
//**********************************************************
//*
//* STEP 1: EXTRACT LARGE CASH TRANSACTIONS
//*
//CTREXT   EXEC PGM=CTREXT01
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//TRANS    DD DSN=BANK.TRANS.DAILY.POSTED,DISP=SHR
//CUSTOMER DD DSN=PROD.CUSTOMER.MASTER,DISP=SHR
//CTROUT   DD DSN=&&CTR,DISP=(NEW,PASS),
//            SPACE=(CYL,(10,5))
//PARMS    DD *
  THRESHOLD=10000.00
  CURRENCY=CASH
  REPORT_DATE=&BUSDATE
/*
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: FORMAT CTR FOR FILING
//*
//CTRFMT   EXEC PGM=CTRFMT01,COND=(0,NE,CTREXT)
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.CTREXT.CTROUT,DISP=(OLD,DELETE)
//CTRFILE  DD DSN=BANK.CTR.FILING.D&BUSDATE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(5,2)),
//            DCB=(RECFM=FB,LRECL=4000)
//REVIEW   DD SYSOUT=A
//SYSPRINT DD SYSOUT=*
//*
//* STEP 3: SAR ANALYSIS
//*
//SARANLZ  EXEC PGM=SARANLZ
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//TRANS    DD DSN=BANK.TRANS.HISTORY.30DAY,DISP=SHR
//PATTERNS DD DSN=PROD.SAR.PATTERN.TABLE,DISP=SHR
//ALERTS   DD DSN=BANK.SAR.ALERTS.D&BUSDATE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(5,2))
//SYSPRINT DD SYSOUT=*
//*
//* STEP 4: ARCHIVE FOR AUDIT
//*
//ARCHIVE  EXEC PGM=IDCAMS,COND=EVEN
//SYSPRINT DD SYSOUT=*
//CTRARCH  DD DSN=BANK.CTR.ARCHIVE(+1),
//            DISP=(NEW,CATLG),SPACE=(CYL,(10,5))
//SARARCH  DD DSN=BANK.SAR.ARCHIVE(+1),
//            DISP=(NEW,CATLG),SPACE=(CYL,(5,2))
//SYSIN    DD *
  REPRO INDATASET(BANK.CTR.FILING.D&BUSDATE) -
        OUTFILE(CTRARCH)
  REPRO INDATASET(BANK.SAR.ALERTS.D&BUSDATE) -
        OUTFILE(SARARCH)
/*
//`}
          language="jcl"
        />
      </section>

      {/* Restart/Recovery Pattern */}
      <section className="space-y-6">
        <h2 className="section-title">Restart and Recovery</h2>

        <CodeBlock
          title="Restartable Job Pattern"
          code={`//RESTJOB  JOB (PROD,RESTART),'RESTARTABLE JOB',
//             CLASS=A,MSGCLASS=H,
//             RESTART=*,              Enable restart
//             NOTIFY=&SYSUID
//*
//**********************************************************
//*  RESTARTABLE BATCH PROCESSING JOB
//*  CHECKPOINTS AFTER EACH MAJOR STEP
//**********************************************************
//*
//* STEP 1: INITIALIZE CHECKPOINT FILE
//*
//INIT     EXEC PGM=IEFBR14
//CHKPT    DD DSN=BANK.JOB.CHECKPOINT,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(TRK,(1,1)),
//            DCB=(RECFM=FB,LRECL=80)
//*
//* STEP 2: EXTRACT (WITH CHECKPOINT)
//*
//EXTRACT  EXEC PGM=EXTRACT,
//             PARM='CHKPT=YES,INTERVAL=10000'
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=BANK.LARGE.INPUT.FILE,DISP=SHR
//OUTPUT   DD DSN=&&EXTRACT,DISP=(NEW,PASS),
//            SPACE=(CYL,(500,100))
//CHKPT    DD DSN=BANK.JOB.CHECKPOINT,DISP=OLD
//RESTART  DD DSN=BANK.EXTRACT.RESTART,
//            DISP=(MOD,CATLG),SPACE=(TRK,(1,1))
//SYSPRINT DD SYSOUT=*
//*
//* STEP 3: PROCESS (WITH COMMIT POINTS)
//*
//PROCESS  EXEC PGM=PROCESS,
//             PARM='COMMIT=1000',
//             COND=(4,LT,EXTRACT)
//STEPLIB  DD DSN=PROD.LOADLIB,DISP=SHR
//INPUT    DD DSN=*.EXTRACT.OUTPUT,DISP=(OLD,DELETE)
//MASTER   DD DSN=PROD.ACCT.MASTER,DISP=OLD
//OUTPUT   DD DSN=BANK.PROCESS.OUTPUT,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50))
//SYSPRINT DD SYSOUT=*
//*
//* RESTART INSTRUCTIONS:
//* 1. Check SYSPRINT for last successful checkpoint
//* 2. Verify BANK.JOB.CHECKPOINT contents
//* 3. Submit with RESTART=EXTRACT or RESTART=PROCESS
//* 4. Job will resume from last checkpoint
//*`}
          language="jcl"
        />

        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-accent-orange flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-orange font-semibold mb-1">Production Restart Procedure</h4>
            <p className="text-gray-300 text-sm">
              Before restarting a production job: (1) Verify what completed successfully, (2) Check for 
              data inconsistencies, (3) Confirm no duplicate processing will occur, (4) Document the 
              restart in the operations log, (5) Notify affected downstream processes.
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <h2 className="section-title">Financial JCL Best Practices</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Production Standards
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Always use IF/THEN for conditional processing</li>
              <li>• Include job-level TIME limit</li>
              <li>• Specify REGION for all steps</li>
              <li>• Use GDGs for audit trails</li>
              <li>• Archive source data before processing</li>
              <li>• Generate control totals at each step</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Error Handling
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Test return codes after every step</li>
              <li>• Have error notification steps (COND=EVEN)</li>
              <li>• Create error files for rejected records</li>
              <li>• Implement restart/recovery points</li>
              <li>• Document manual intervention procedures</li>
              <li>• Maintain run books for on-call support</li>
            </ul>
          </div>
        </div>

        <div className="card-highlight">
          <h3 className="subsection-title">Naming Conventions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Pattern</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">Job Name</td>
                <td>APPDDNNN</td>
                <td>GLPD001 (GL Posting Daily #1)</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Step Name</td>
                <td>Action or Sequence</td>
                <td>EXTRACT, SORT, POST, STEP010</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Data Set</td>
                <td>ENV.APP.TYPE.NAME</td>
                <td>PROD.GL.TRANS.DAILY</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">GDG Base</td>
                <td>ENV.APP.NAME.GDGTYPE</td>
                <td>PROD.AUDIT.TRAIL</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">PROC</td>
                <td>APPFUNC</td>
                <td>GLPOST, EODVAL, STMTGEN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Completion */}
      <section className="card-highlight gradient-border text-center py-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">
          🎉 Congratulations!
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          You've completed all seven modules of the JCL Education Platform! You now have a 
          comprehensive understanding of Job Control Language for IBM z/OS mainframes, with 
          specialized knowledge of financial industry batch processing patterns.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/playground" className="btn-primary inline-flex items-center gap-2">
            Practice in Playground
          </Link>
          <Link to="/cheatsheet" className="btn-secondary">
            Reference Cheat Sheet
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/6"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 6: Utilities</span>
        </Link>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          Back to Home
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

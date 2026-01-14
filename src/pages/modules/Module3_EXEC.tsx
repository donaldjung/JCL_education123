import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Play, AlertTriangle, CheckCircle2 } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module3_EXEC() {
  const condDiagram = `
flowchart TD
    A[Step Execution] --> B{COND Test}
    B -->|Condition TRUE| C[BYPASS Step]
    B -->|Condition FALSE| D[EXECUTE Step]
    
    D --> E{Step Completes}
    E --> F[Return Code]
    F --> G[Next Step COND Test]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style C fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
    style D fill:#1a1a2e,stroke:#00ff88,color:#00ff88
`

  const ifThenDiagram = `
flowchart TD
    A[IF Statement] --> B{Condition}
    B -->|TRUE| C[THEN Statements]
    B -->|FALSE| D[ELSE Statements]
    C --> E[ENDIF]
    D --> E
    E --> F[Continue Job]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style C fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style D fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
`

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-mainframe-amber">Home</Link>
          <span className="text-gray-600">/</span>
          <span className="text-mainframe-amber">Module 3</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/30">
            <Play className="text-accent-cyan" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">EXEC Statement & Programs</h1>
            <p className="text-gray-400 mt-1">Program execution, PARM, COND codes, and conditional processing</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">The EXEC Statement</h2>
        <p className="text-gray-300 leading-relaxed">
          The <strong className="text-accent-cyan">EXEC (Execute)</strong> statement identifies the program 
          or procedure to run for each job step. It's the heart of JCL processing—controlling which code 
          executes and under what conditions.
        </p>
        <p className="text-gray-300 leading-relaxed">
          In financial batch processing, EXEC statements coordinate the execution of transaction processors, 
          report generators, and data validation programs, with condition codes determining the flow of 
          multi-step jobs.
        </p>
      </section>

      {/* Basic EXEC Statement */}
      <section className="space-y-6">
        <h2 className="section-title">Basic EXEC Statement</h2>

        <CodeBlock
          title="EXEC Statement Syntax"
          code={`//stepname EXEC PGM=program-name,parameters
//
//* Execute a program directly
//STEP010  EXEC PGM=IEFBR14
//
//* Execute with parameters
//STEP020  EXEC PGM=ACCTPROC,
//             PARM='DAILY,VALIDATE',
//             TIME=10,
//             REGION=256M
//
//* Execute a cataloged procedure
//STEP030  EXEC PROC=DAILYRPT
//
//* Short form for procedure
//STEP040  EXEC DAILYRPT`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">EXEC Parameters</h3>
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
                <td className="text-mainframe-amber">PGM</td>
                <td>Program name to execute</td>
                <td><code>PGM=IEFBR14</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">PROC</td>
                <td>Procedure name to invoke</td>
                <td><code>PROC=SORTPROC</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">PARM</td>
                <td>Pass parameters to program</td>
                <td><code>PARM='RUN=DAILY'</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">COND</td>
                <td>Conditional execution</td>
                <td><code>COND=(4,LT)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">TIME</td>
                <td>CPU time limit (step level)</td>
                <td><code>TIME=(5,30)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">REGION</td>
                <td>Memory allocation (step)</td>
                <td><code>REGION=512M</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">ACCT</td>
                <td>Step accounting info</td>
                <td><code>ACCT=(DEPT45)</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PARM Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">PARM Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">PARM</code> parameter passes information directly to the 
          executing program. The format depends on how the program expects to receive parameters.
        </p>

        <CodeBlock
          title="PARM Examples"
          code={`//* Simple PARM value (max 100 characters)
//STEP01   EXEC PGM=MYPROG,PARM='DAILY'

//* Multiple values (comma-separated)
//STEP02   EXEC PGM=TRANSACT,PARM='BRANCH=001,DATE=20240115'

//* COBOL program PARM (passed to PROCEDURE DIVISION USING)
//STEP03   EXEC PGM=COBPROG,PARM='VALIDATE,AUDIT'

//* PARM with special characters (use quotes)
//STEP04   EXEC PGM=UTILPROG,PARM='/DEBUG,TRACE=ON'

//* Long PARM with continuation
//STEP05   EXEC PGM=COMPLEX,
//             PARM=('REGION=MIDWEST,TYPE=SUMMARY,',
//             'FORMAT=CSV,HEADER=YES')

//* SORT program PARM
//SORT     EXEC PGM=SORT,PARM='DYNALLOC=(SYSDA,5)'

//* DFSORT with parameters
//SORTSTEP EXEC PGM=ICEMAN,PARM='FILSZ=E50000'

//* Language Environment PARM for COBOL
//COBOL    EXEC PGM=ACCTMAIN,
//             PARM='/RPTOPTS(ON),RPTSTG(ON)'`}
          language="jcl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              PARM Best Practices
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Document expected PARM values</li>
              <li>• Use symbolic parameters for flexibility</li>
              <li>• Keep under 100 characters when possible</li>
              <li>• Quote strings with special characters</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-orange font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} />
              Common Pitfalls
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Exceeding 100-character limit</li>
              <li>• Forgetting quotes around special chars</li>
              <li>• Mismatched PARM format with program</li>
              <li>• Not handling empty PARM in program</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Condition Codes */}
      <section className="space-y-6">
        <h2 className="section-title">Condition Codes (Return Codes)</h2>
        
        <p className="text-gray-300 leading-relaxed">
          Every program sets a <strong className="text-mainframe-amber">return code</strong> (0-4095) when 
          it ends. These codes indicate the success or failure of the program and are used by subsequent 
          steps to determine whether to execute.
        </p>

        <div className="card-highlight">
          <h3 className="subsection-title">Standard Return Code Meanings</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Meaning</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-green font-mono">0</td>
                <td>Successful completion</td>
                <td>Continue processing</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber font-mono">4</td>
                <td>Warning - minor issues</td>
                <td>Review, usually continue</td>
              </tr>
              <tr>
                <td className="text-accent-orange font-mono">8</td>
                <td>Error - significant issues</td>
                <td>May skip dependent steps</td>
              </tr>
              <tr>
                <td className="text-red-400 font-mono">12</td>
                <td>Severe error</td>
                <td>Typically stop processing</td>
              </tr>
              <tr>
                <td className="text-red-500 font-mono">16+</td>
                <td>Critical failure</td>
                <td>Stop immediately</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* COND Parameter */}
      <section className="space-y-6">
        <h2 className="section-title">COND Parameter</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">COND</code> parameter controls whether a step executes based 
          on return codes from previous steps. <strong>Important:</strong> COND specifies when to 
          <em className="text-accent-orange"> bypass</em> a step, not when to execute it.
        </p>

        <FlowDiagram chart={condDiagram} title="COND Parameter Logic" />

        <CodeBlock
          title="COND Parameter Syntax and Examples"
          code={`//         COND=(code,operator)          Basic form
//         COND=(code,operator,stepname)  Test specific step
//         COND=((code,op),(code,op))     Multiple conditions
//
//* Bypass step if any previous RC >= 4
//STEP02   EXEC PGM=PROCESS,COND=(4,LE)

//* Bypass if STEP01 RC > 0 (only run if STEP01 got 0)
//STEP02   EXEC PGM=NEXT,COND=(0,NE,STEP01)

//* Bypass if RC = 8 exactly
//STEP03   EXEC PGM=REPORT,COND=(8,EQ)

//* Multiple conditions (OR logic - bypass if ANY true)
//STEP04   EXEC PGM=CLEANUP,
//             COND=((4,LT),(8,EQ,STEP02))

//* Always execute (even if previous abend)
//CLEANUP  EXEC PGM=CLEANUP,COND=EVEN

//* Execute only if previous abend
//RECOVERY EXEC PGM=RECOVER,COND=ONLY`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">COND Operators</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-mainframe-amber">GT</td>
                    <td>Greater Than</td>
                  </tr>
                  <tr>
                    <td className="text-mainframe-amber">GE</td>
                    <td>Greater than or Equal</td>
                  </tr>
                  <tr>
                    <td className="text-mainframe-amber">LT</td>
                    <td>Less Than</td>
                  </tr>
                  <tr>
                    <td className="text-mainframe-amber">LE</td>
                    <td>Less than or Equal</td>
                  </tr>
                  <tr>
                    <td className="text-mainframe-amber">EQ</td>
                    <td>Equal</td>
                  </tr>
                  <tr>
                    <td className="text-mainframe-amber">NE</td>
                    <td>Not Equal</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="text-accent-cyan font-semibold mb-3">Special Values</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><code className="code-inline">COND=EVEN</code> - Execute even after abend</li>
                <li><code className="code-inline">COND=ONLY</code> - Execute only after abend</li>
                <li><code className="code-inline">COND=((4,LT),EVEN)</code> - Combined</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-accent-orange flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-orange font-semibold mb-1">COND Logic Warning</h4>
            <p className="text-gray-300 text-sm">
              Remember: COND tests when to <strong>bypass</strong> a step. <code className="code-inline">COND=(0,NE)</code> 
              means "bypass if return code is not equal to 0" - so the step runs only when RC=0. Many 
              beginners get this backwards!
            </p>
          </div>
        </div>
      </section>

      {/* IF/THEN/ELSE */}
      <section className="space-y-6">
        <h2 className="section-title">IF/THEN/ELSE/ENDIF</h2>
        
        <p className="text-gray-300 leading-relaxed">
          Modern JCL provides <code className="code-inline">IF/THEN/ELSE/ENDIF</code> statements for 
          more readable conditional processing. These are preferred over complex COND parameters.
        </p>

        <FlowDiagram chart={ifThenDiagram} title="IF/THEN/ELSE Flow" />

        <CodeBlock
          title="IF/THEN/ELSE Examples"
          code={`//* Basic IF/THEN/ELSE structure
//         IF (STEP01.RC = 0) THEN
//STEP02     EXEC PGM=SUCCESS
//         ELSE
//STEPERR    EXEC PGM=ERROR
//         ENDIF
//
//* Multiple conditions with AND/OR
//         IF (STEP01.RC <= 4 AND STEP02.RC = 0) THEN
//STEP03     EXEC PGM=CONTINUE
//         ENDIF
//
//* Testing for abend
//         IF (STEP01.ABEND) THEN
//RECOVER    EXEC PGM=RECOVER
//         ENDIF
//
//* Check if step ran (not bypassed)
//         IF (STEP01.RUN) THEN
//STEP02     EXEC PGM=POSTSTEP
//         ENDIF
//
//* Complex nested conditions
//         IF (EXTRACT.RC = 0) THEN
//           IF (VALIDATE.RC <= 4) THEN
//PROCESS      EXEC PGM=PROCESS
//           ELSE
//FIXDATA      EXEC PGM=FIXDATA
//           ENDIF
//         ELSE
//RESTART      EXEC PGM=RESTART
//         ENDIF`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">IF Statement Conditions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Condition</th>
                <th>Tests For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">stepname.RC op value</td>
                <td>Return code comparison</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">stepname.ABEND</td>
                <td>Step abended</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">stepname.ABENDCC = Sxxx</td>
                <td>Specific system abend</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">stepname.ABENDCC = Unnnn</td>
                <td>Specific user abend</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">stepname.RUN</td>
                <td>Step executed (not bypassed)</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">~stepname.RUN</td>
                <td>Step was bypassed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Financial Example */}
      <section className="space-y-6">
        <h2 className="section-title">Financial Batch Processing Example</h2>

        <CodeBlock
          title="Transaction Processing with Conditional Logic"
          code={`//TRANPROC JOB (FIN,PROC),'TRANS PROCESSING',
//             CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID
//*
//**********************************************************
//*  DAILY TRANSACTION PROCESSING
//*  Includes validation, processing, and error handling
//**********************************************************
//*
//* STEP 1: VALIDATE INPUT TRANSACTIONS
//*
//VALIDATE EXEC PGM=VALITRAN,PARM='STRICT=YES'
//INPUT    DD DSN=BANK.TRANS.DAILY.INPUT,DISP=SHR
//VALID    DD DSN=&&VALID,DISP=(NEW,PASS)
//INVALID  DD DSN=BANK.TRANS.DAILY.INVALID,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(5,2))
//SYSPRINT DD SYSOUT=*
//*
//* STEP 2: PROCESS VALID TRANSACTIONS
//*         Only if validation successful (RC <= 4)
//*
//         IF (VALIDATE.RC <= 4) THEN
//PROCESS  EXEC PGM=PROCTRN,PARM='MODE=UPDATE'
//INPUT    DD DSN=*.VALIDATE.VALID,DISP=(OLD,DELETE)
//MASTER   DD DSN=BANK.ACCOUNTS.MASTER,DISP=OLD
//OUTPUT   DD DSN=BANK.TRANS.DAILY.POSTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25))
//AUDIT    DD DSN=BANK.AUDIT.TRAIL(+1),
//            DISP=(NEW,CATLG),
//            SPACE=(CYL,(10,5))
//SYSPRINT DD SYSOUT=*
//         ENDIF
//*
//* STEP 3: GENERATE REPORTS
//*         Only if processing completed successfully
//*
//         IF (PROCESS.RC = 0) THEN
//REPORTS  EXEC PGM=RPTGEN,PARM='FORMAT=STANDARD'
//INPUT    DD DSN=BANK.TRANS.DAILY.POSTED,DISP=SHR
//SUMMARY  DD SYSOUT=A
//DETAIL   DD SYSOUT=A
//         ELSE
//* ERROR HANDLING
//ERRPROC  EXEC PGM=ERRHAND,COND=EVEN
//ERRORS   DD DSN=BANK.TRANS.DAILY.INVALID,DISP=SHR
//REPORT   DD SYSOUT=*
//         ENDIF
//*
//* CLEANUP: Always runs
//*
//CLEANUP  EXEC PGM=CLEANUP,COND=EVEN
//TEMP     DD DSN=&&VALID,DISP=(OLD,DELETE)
//`}
          language="jcl"
        />
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/2"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 2: DD Statements</span>
        </Link>
        <Link
          to="/module/4"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 4: Procedures
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

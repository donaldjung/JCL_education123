import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Wrench, Info, CheckCircle2 } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module6_Utilities() {
  const utilitiesDiagram = `
flowchart TD
    A[z/OS Utilities] --> B[Data Set Utilities]
    A --> C[System Utilities]
    A --> D[Sort/Merge]
    
    B --> B1[IEBGENER]
    B --> B2[IEBCOPY]
    B --> B3[IEBCOMPR]
    
    C --> C1[IEFBR14]
    C --> C2[IEHLIST]
    C --> C3[IEHINITT]
    
    D --> D1[DFSORT/ICEMAN]
    D --> D2[SYNCSORT]
    
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
          <span className="text-mainframe-amber">Module 6</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-mainframe-green/10 flex items-center justify-center border border-mainframe-green/30">
            <Wrench className="text-mainframe-green" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">z/OS Utilities</h1>
            <p className="text-gray-400 mt-1">IEBGENER, IEBCOPY, DFSORT, and essential system utilities</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">z/OS Utility Programs</h2>
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-mainframe-green">Utility programs</strong> are IBM-supplied programs that 
          perform common data set operations. They are the workhorses of mainframe batch processing—copying, 
          sorting, comparing, and managing data sets without custom programming.
        </p>
        <p className="text-gray-300 leading-relaxed">
          In financial batch processing, utilities handle file preparation, data movement, reformatting, 
          and validation. Mastering these utilities is essential for efficient JCL development.
        </p>
        
        <FlowDiagram chart={utilitiesDiagram} title="Common z/OS Utilities" />
      </section>

      {/* IEFBR14 */}
      <section className="space-y-6">
        <h2 className="section-title">IEFBR14 - The "Do Nothing" Program</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <code className="code-inline">IEFBR14</code> is a program that does nothing but return to the 
          operating system. Its value is in the DD statements—used to create, delete, or catalog data sets.
        </p>

        <CodeBlock
          title="IEFBR14 Examples"
          code={`//CREATEDS JOB (ACCT),'CREATE DATA SETS',CLASS=A
//*
//* CREATE A NEW DATA SET
//*
//CREATE   EXEC PGM=IEFBR14
//NEWFILE  DD DSN=PROD.NEW.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE),
//            DCB=(RECFM=FB,LRECL=100,BLKSIZE=0)
//*
//* DELETE A DATA SET
//*
//DELETE   EXEC PGM=IEFBR14
//OLDFILE  DD DSN=PROD.OLD.FILE,DISP=(OLD,DELETE)
//*
//* CREATE A PDS
//*
//CREATEPD EXEC PGM=IEFBR14
//LIBRARY  DD DSN=PROD.JCL.LIBRARY,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(10,5,50)),
//            DCB=(RECFM=FB,LRECL=80,BLKSIZE=27920,DSORG=PO)
//*
//* CREATE MULTIPLE DATA SETS
//*
//MULTI    EXEC PGM=IEFBR14
//FILE1    DD DSN=PROD.FILE1,DISP=(NEW,CATLG),SPACE=(TRK,(5,2))
//FILE2    DD DSN=PROD.FILE2,DISP=(NEW,CATLG),SPACE=(TRK,(5,2))
//FILE3    DD DSN=PROD.FILE3,DISP=(NEW,CATLG),SPACE=(TRK,(5,2))`}
          language="jcl"
        />

        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4 flex gap-3">
          <Info className="text-accent-cyan flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-cyan font-semibold mb-1">Why IEFBR14?</h4>
            <p className="text-gray-300 text-sm">
              The name comes from the single instruction: <code className="code-inline">BR 14</code> 
              (Branch to Register 14), which returns to the caller. It's the shortest possible 
              executable program—just one instruction!
            </p>
          </div>
        </div>
      </section>

      {/* IEBGENER */}
      <section className="space-y-6">
        <h2 className="section-title">IEBGENER - Copy Sequential Data Sets</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <code className="code-inline">IEBGENER</code> copies sequential data sets, PDS members, and 
          can perform simple reformatting. It's one of the most commonly used utilities.
        </p>

        <CodeBlock
          title="IEBGENER Examples"
          code={`//COPYJOB  JOB (ACCT),'COPY FILES',CLASS=A
//*
//* SIMPLE COPY - SEQUENTIAL TO SEQUENTIAL
//*
//COPY     EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY                 No control statements
//SYSUT1   DD DSN=INPUT.FILE,DISP=SHR
//SYSUT2   DD DSN=OUTPUT.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE),
//            DCB=(RECFM=FB,LRECL=100)
//*
//* COPY PDS MEMBER
//*
//COPYMEM  EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
//SYSUT1   DD DSN=SOURCE.PDS(MEMBER1),DISP=SHR
//SYSUT2   DD DSN=TARGET.PDS(MEMBER1),DISP=SHR
//*
//* COPY WITH DCB OVERRIDE
//*
//REBLOCK  EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
//SYSUT1   DD DSN=INPUT.FILE,DISP=SHR
//SYSUT2   DD DSN=OUTPUT.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE),
//            DCB=(RECFM=FB,LRECL=100,BLKSIZE=27900)
//*
//* CREATE FILE FROM INSTREAM DATA
//*
//CREATEIN EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
//SYSUT1   DD *
RECORD 1 DATA
RECORD 2 DATA
RECORD 3 DATA
/*
//SYSUT2   DD DSN=NEW.FILE,DISP=(NEW,CATLG),
//            SPACE=(TRK,(1,1)),
//            DCB=(RECFM=FB,LRECL=80)`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">IEBGENER DD Names</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>DD Name</th>
                <th>Purpose</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">SYSUT1</td>
                <td>Input data set</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">SYSUT2</td>
                <td>Output data set</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">SYSIN</td>
                <td>Control statements (DUMMY for simple copy)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">SYSPRINT</td>
                <td>Messages and statistics</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* IEBCOPY */}
      <section className="space-y-6">
        <h2 className="section-title">IEBCOPY - PDS Copy Utility</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <code className="code-inline">IEBCOPY</code> is designed for PDS and PDSE operations—copying, 
          compressing, and managing partitioned data sets.
        </p>

        <CodeBlock
          title="IEBCOPY Examples"
          code={`//PDSCOPY  JOB (ACCT),'PDS OPERATIONS',CLASS=A
//*
//* COPY ENTIRE PDS
//*
//COPYALL  EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//INPDS    DD DSN=SOURCE.PDS,DISP=SHR
//OUTPDS   DD DSN=TARGET.PDS,DISP=SHR
//SYSIN    DD *
  COPY INDD=INPDS,OUTDD=OUTPDS
/*
//*
//* COPY SELECTED MEMBERS
//*
//COPYSEL  EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//INPDS    DD DSN=SOURCE.PDS,DISP=SHR
//OUTPDS   DD DSN=TARGET.PDS,DISP=SHR
//SYSIN    DD *
  COPY INDD=INPDS,OUTDD=OUTPDS
  SELECT MEMBER=(MEMBER1,MEMBER2,MEMBER3)
/*
//*
//* COPY WITH RENAME
//*
//COPYRN   EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//INPDS    DD DSN=SOURCE.PDS,DISP=SHR
//OUTPDS   DD DSN=TARGET.PDS,DISP=SHR
//SYSIN    DD *
  COPY INDD=INPDS,OUTDD=OUTPDS
  SELECT MEMBER=((OLDNAME,NEWNAME,R))
/*
//*
//* COMPRESS PDS IN PLACE
//*
//COMPRESS EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//PDS      DD DSN=MY.PDS.LIBRARY,DISP=OLD
//SYSIN    DD *
  COPY INDD=PDS,OUTDD=PDS
/*
//*
//* EXCLUDE MEMBERS
//*
//EXCLUDE  EXEC PGM=IEBCOPY
//SYSPRINT DD SYSOUT=*
//INPDS    DD DSN=SOURCE.PDS,DISP=SHR
//OUTPDS   DD DSN=TARGET.PDS,DISP=SHR
//SYSIN    DD *
  COPY INDD=INPDS,OUTDD=OUTPDS
  EXCLUDE MEMBER=(TEMP1,TEMP2,TEST*)
/*`}
          language="jcl"
        />
      </section>

      {/* DFSORT */}
      <section className="space-y-6">
        <h2 className="section-title">DFSORT (SORT/ICEMAN)</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <code className="code-inline">DFSORT</code> (also called SORT or ICEMAN) is the most powerful 
          and frequently used utility. It sorts, merges, copies, and transforms data with extensive 
          capabilities for data manipulation.
        </p>

        <CodeBlock
          title="Basic DFSORT Examples"
          code={`//SORTJOB  JOB (ACCT),'SORT DATA',CLASS=A
//*
//* SIMPLE ASCENDING SORT
//*
//SORT     EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=OUTPUT.FILE,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(50,25),RLSE)
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)
/*
//*
//* MULTIPLE SORT KEYS
//*
//MULTKEY  EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=TRANS.FILE,DISP=SHR
//SORTOUT  DD DSN=TRANS.SORTED,DISP=(NEW,CATLG),
//            SPACE=(CYL,(100,50))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A,     Account (ascending)
               11,8,PD,D,     Amount (descending)
               19,8,CH,A)     Date (ascending)
/*
//*
//* DESCENDING SORT
//*
//SORTDESC EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=OUTPUT.FILE,DISP=(NEW,CATLG),SPACE=(CYL,(50,25))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,D)
/*`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">SORT FIELDS Parameter</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">Position</td>
                <td>Starting byte position</td>
                <td>1-32760</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Length</td>
                <td>Field length in bytes</td>
                <td>1-32760</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Format</td>
                <td>Data format</td>
                <td>CH, ZD, PD, BI, FI, FL</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">Order</td>
                <td>Sort order</td>
                <td>A (ascending), D (descending)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="DFSORT with INCLUDE/OMIT"
          code={`//*
//* SELECT RECORDS WITH INCLUDE
//*
//INCLUDE  EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=ALL.TRANS,DISP=SHR
//SORTOUT  DD DSN=SELECTED.TRANS,DISP=(NEW,CATLG),
//            SPACE=(CYL,(50,25))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)
  INCLUDE COND=(15,3,CH,EQ,C'ACT',AND,
                20,1,CH,NE,C'X')
/*
//*
//* EXCLUDE RECORDS WITH OMIT
//*
//OMIT     EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=ALL.TRANS,DISP=SHR
//SORTOUT  DD DSN=FILTERED.TRANS,DISP=(NEW,CATLG),
//            SPACE=(CYL,(50,25))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)
  OMIT COND=(15,1,CH,EQ,C'D')   Omit deleted records
/*`}
          language="jcl"
        />

        <CodeBlock
          title="DFSORT with INREC/OUTREC"
          code={`//*
//* REFORMAT RECORDS WITH OUTREC
//*
//REFORMAT EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=OUTPUT.FILE,DISP=(NEW,CATLG),
//            SPACE=(CYL,(50,25)),
//            DCB=(RECFM=FB,LRECL=80)
//SYSIN    DD *
  SORT FIELDS=COPY           Just copy, no sort
  OUTREC FIELDS=(1,10,       Account number
                 C' - ',     Literal dash
                 11,30,      Name
                 C', ',      Comma space
                 41,10)      Balance
/*
//*
//* ADD SEQUENCE NUMBERS
//*
//ADDSEQ   EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=INPUT.FILE,DISP=SHR
//SORTOUT  DD DSN=OUTPUT.FILE,DISP=(NEW,CATLG),
//            SPACE=(CYL,(50,25)),DCB=(LRECL=88)
//SYSIN    DD *
  SORT FIELDS=COPY
  OUTREC FIELDS=(SEQNUM,8,ZD,   8-digit sequence number
                 1,80)          Original record
/*
//*
//* SUMMARIZE WITH SUM
//*
//SUMMARY  EXEC PGM=SORT
//SYSOUT   DD SYSOUT=*
//SORTIN   DD DSN=TRANS.FILE,DISP=SHR
//SORTOUT  DD DSN=SUMMARY.FILE,DISP=(NEW,CATLG),
//            SPACE=(CYL,(10,5))
//SYSIN    DD *
  SORT FIELDS=(1,10,CH,A)     Sort by account
  SUM FIELDS=(20,8,PD)        Sum amount field
/*`}
          language="jcl"
        />
      </section>

      {/* ICETOOL */}
      <section className="space-y-6">
        <h2 className="section-title">ICETOOL - Multiple Operations</h2>

        <CodeBlock
          title="ICETOOL Examples"
          code={`//ICETOOL  JOB (ACCT),'ICETOOL',CLASS=A
//STEP01   EXEC PGM=ICETOOL
//TOOLMSG  DD SYSOUT=*
//DFSMSG   DD SYSOUT=*
//INFILE   DD DSN=INPUT.FILE,DISP=SHR
//OUTFIL1  DD DSN=OUTPUT1.FILE,DISP=(NEW,CATLG),SPACE=(CYL,(50,25))
//OUTFIL2  DD DSN=OUTPUT2.FILE,DISP=(NEW,CATLG),SPACE=(CYL,(50,25))
//REPORT   DD SYSOUT=*
//TOOLIN   DD *
* SORT THE INPUT AND CREATE TWO OUTPUTS
  SORT FROM(INFILE) TO(OUTFIL1) USING(SRT1)
  COPY FROM(INFILE) TO(OUTFIL2) USING(CPY1)
  COUNT FROM(INFILE) WRITE(REPORT)
/*
//SRT1CNTL DD *
  SORT FIELDS=(1,10,CH,A)
  INCLUDE COND=(15,1,CH,EQ,C'A')
/*
//CPY1CNTL DD *
  SORT FIELDS=COPY
  INCLUDE COND=(15,1,CH,EQ,C'B')
/*`}
          language="jcl"
        />
      </section>

      {/* Other Utilities */}
      <section className="space-y-6">
        <h2 className="section-title">Other Common Utilities</h2>

        <CodeBlock
          title="Various Utility Examples"
          code={`//*
//* IEBCOMPR - COMPARE DATA SETS
//*
//COMPARE  EXEC PGM=IEBCOMPR
//SYSPRINT DD SYSOUT=*
//SYSUT1   DD DSN=FILE1,DISP=SHR
//SYSUT2   DD DSN=FILE2,DISP=SHR
//SYSIN    DD *
  COMPARE TYPORG=PS
/*
//*
//* IEHLIST - LIST VTOC OR PDS DIRECTORY
//*
//LISTVTOC EXEC PGM=IEHLIST
//SYSPRINT DD SYSOUT=*
//DASD     DD UNIT=SYSDA,VOL=SER=PROD01,DISP=OLD
//SYSIN    DD *
  LISTVTOC VOL=SYSDA=PROD01,FORMAT
/*
//*
//* LISTPDS DIRECTORY
//*
//LISTPDS  EXEC PGM=IEHLIST
//SYSPRINT DD SYSOUT=*
//PDS      DD DSN=MY.PDS.LIBRARY,DISP=SHR
//SYSIN    DD *
  LISTPDS DSNAME=MY.PDS.LIBRARY,FORMAT
/*
//*
//* IEHPROGM - SCRATCH/RENAME (legacy)
//*
//RENAME   EXEC PGM=IEHPROGM
//SYSPRINT DD SYSOUT=*
//DASD     DD UNIT=SYSDA,VOL=SER=PROD01,DISP=OLD
//SYSIN    DD *
  RENAME DSNAME=OLD.NAME,VOL=SYSDA=PROD01,NEWNAME=NEW.NAME
/*`}
          language="jcl"
        />
      </section>

      {/* Utility Best Practices */}
      <section className="space-y-6">
        <h2 className="section-title">Utility Best Practices</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Best Practices
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Use BLKSIZE=0 for system-optimized blocking</li>
              <li>• Specify SPACE with RLSE for large files</li>
              <li>• Use SORT FILSZ parameter for large sorts</li>
              <li>• Check return codes after each step</li>
              <li>• Document complex SYSIN control cards</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3 flex items-center gap-2">
              <Info size={18} />
              Performance Tips
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• SORT: Use DYNALLOC for work space</li>
              <li>• IEBCOPY: Use COPYMOD for load libraries</li>
              <li>• Large files: Consider SORT over IEBGENER</li>
              <li>• Use SORTOUT when possible (skip SORTIN)</li>
              <li>• ICETOOL for multiple output files</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/5"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 5: VSAM & IDCAMS</span>
        </Link>
        <Link
          to="/module/7"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 7: Financial Patterns
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

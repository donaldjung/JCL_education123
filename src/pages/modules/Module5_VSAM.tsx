import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, HardDrive, AlertTriangle, Info } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module5_VSAM() {
  const vsamTypesDiagram = `
flowchart TD
    A[VSAM Data Sets] --> B[KSDS]
    A --> C[ESDS]
    A --> D[RRDS]
    A --> E[LDS]
    
    B --> B1[Key Sequenced]
    B --> B2[Primary + Alternate Index]
    
    C --> C1[Entry Sequenced]
    C --> C2[Sequential Access]
    
    D --> D1[Relative Record]
    D --> D2[Slot-based Access]
    
    E --> E1[Linear Data Set]
    E --> E2[Byte-stream]
    
    style A fill:#1a1a2e,stroke:#ffb000,color:#ffb000
    style B fill:#1a1a2e,stroke:#00ff88,color:#00ff88
    style C fill:#1a1a2e,stroke:#00d4ff,color:#00d4ff
    style D fill:#1a1a2e,stroke:#ff6b35,color:#ff6b35
    style E fill:#1a1a2e,stroke:#ffb000,color:#ffb000
`

  const ksdsStructureDiagram = `
flowchart LR
    A[KSDS Cluster] --> B[Data Component]
    A --> C[Index Component]
    
    C --> D[Index Set]
    D --> E[Sequence Set]
    E --> B
    
    B --> F[Control Intervals]
    F --> G[Records + Free Space]
    
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
          <span className="text-mainframe-amber">Module 5</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-mainframe-amber/10 flex items-center justify-center border border-mainframe-amber/30">
            <HardDrive className="text-mainframe-amber" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">VSAM & IDCAMS</h1>
            <p className="text-gray-400 mt-1">Virtual Storage Access Method and Access Method Services</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="card-dark space-y-4">
        <h2 className="section-title">What is VSAM?</h2>
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-mainframe-amber">VSAM (Virtual Storage Access Method)</strong> is IBM's 
          high-performance file access method for z/OS. It provides sophisticated data organization, 
          indexing, and access capabilities essential for enterprise applications.
        </p>
        <p className="text-gray-300 leading-relaxed">
          In financial institutions, VSAM files store critical data like customer accounts, transaction 
          histories, and reference tables. Understanding VSAM is essential for mainframe batch processing 
          and CICS online systems.
        </p>
        
        <FlowDiagram chart={vsamTypesDiagram} title="VSAM Data Set Types" />
      </section>

      {/* VSAM Types */}
      <section className="space-y-6">
        <h2 className="section-title">VSAM Data Set Types</h2>

        <div className="card-highlight">
          <h3 className="subsection-title">VSAM Organization Types</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">KSDS</td>
                <td>Key Sequenced - records accessed by key</td>
                <td>Account master files, customer records</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">ESDS</td>
                <td>Entry Sequenced - records in arrival order</td>
                <td>Transaction logs, audit trails</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">RRDS</td>
                <td>Relative Record - accessed by slot number</td>
                <td>Direct lookup tables</td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">LDS</td>
                <td>Linear Data Set - byte-stream storage</td>
                <td>DB2 tablespaces, large objects</td>
              </tr>
            </tbody>
          </table>
        </div>

        <FlowDiagram chart={ksdsStructureDiagram} title="KSDS Structure" />
      </section>

      {/* IDCAMS Introduction */}
      <section className="space-y-6">
        <h2 className="section-title">IDCAMS Utility</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-mainframe-green">IDCAMS (Access Method Services)</strong> is the utility 
          program for creating, maintaining, and managing VSAM and non-VSAM data sets. All VSAM cluster 
          definitions and operations are performed through IDCAMS.
        </p>

        <CodeBlock
          title="Basic IDCAMS JCL"
          code={`//IDCAMS   JOB (ACCT),'IDCAMS UTILITY',CLASS=A
//*
//STEP01   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* IDCAMS COMMANDS GO HERE */
  LISTCAT ENTRIES(PROD.ACCT.MASTER) ALL
/*`}
          language="jcl"
        />
      </section>

      {/* DEFINE CLUSTER */}
      <section className="space-y-6">
        <h2 className="section-title">DEFINE CLUSTER</h2>
        
        <p className="text-gray-300 leading-relaxed">
          The <code className="code-inline">DEFINE CLUSTER</code> command creates VSAM data sets. 
          Understanding the parameters is crucial for optimal performance and space utilization.
        </p>

        <CodeBlock
          title="Define KSDS Cluster"
          code={`//DEFKSDS  JOB (ACCT),'DEFINE KSDS',CLASS=A
//STEP01   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE CLUSTER -
         (NAME(PROD.ACCT.MASTER) -
          INDEXED -
          RECORDSIZE(500 500) -
          KEYS(10 0) -
          FREESPACE(20 10) -
          SHAREOPTIONS(2 3) -
          SPEED -
          REUSE) -
         DATA -
          (NAME(PROD.ACCT.MASTER.DATA) -
           CYLINDERS(100 50) -
           CONTROLINTERVALSIZE(4096)) -
         INDEX -
          (NAME(PROD.ACCT.MASTER.INDEX) -
           CYLINDERS(10 5) -
           CONTROLINTERVALSIZE(2048))
/*`}
          language="jcl"
        />

        <div className="card-highlight">
          <h3 className="subsection-title">Key DEFINE CLUSTER Parameters</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mainframe-amber">NAME</td>
                <td>Cluster name (data set name)</td>
                <td><code>NAME(PROD.FILE)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">INDEXED</td>
                <td>Creates KSDS</td>
                <td><code>INDEXED</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">NONINDEXED</td>
                <td>Creates ESDS</td>
                <td><code>NONINDEXED</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">NUMBERED</td>
                <td>Creates RRDS</td>
                <td><code>NUMBERED</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">RECORDSIZE</td>
                <td>(average max) record size</td>
                <td><code>RECORDSIZE(200 500)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">KEYS</td>
                <td>(length offset) for KSDS</td>
                <td><code>KEYS(10 0)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">FREESPACE</td>
                <td>(CI% CA%) free space</td>
                <td><code>FREESPACE(20 10)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">SHAREOPTIONS</td>
                <td>(crossregion crosssystem)</td>
                <td><code>SHAREOPTIONS(2 3)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">CYLINDERS/TRACKS</td>
                <td>(primary secondary) space</td>
                <td><code>CYLINDERS(100 50)</code></td>
              </tr>
              <tr>
                <td className="text-mainframe-amber">CONTROLINTERVALSIZE</td>
                <td>CI size in bytes</td>
                <td><code>CISIZE(4096)</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Define ESDS Cluster"
          code={`//DEFESDS  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE CLUSTER -
         (NAME(PROD.TRANS.LOG) -
          NONINDEXED -
          RECORDSIZE(100 200) -
          SHAREOPTIONS(1 3)) -
         DATA -
          (NAME(PROD.TRANS.LOG.DATA) -
           CYLINDERS(50 25) -
           CONTROLINTERVALSIZE(8192))
/*`}
          language="jcl"
        />
      </section>

      {/* REPRO Command */}
      <section className="space-y-6">
        <h2 className="section-title">REPRO Command</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <code className="code-inline">REPRO</code> copies records between data sets. It's the primary 
          tool for loading VSAM files, backing up data, and converting between file types.
        </p>

        <CodeBlock
          title="REPRO Examples"
          code={`//LOADVSAM JOB (ACCT),'LOAD VSAM',CLASS=A
//STEP01   EXEC PGM=IDCAMS
//INFILE   DD DSN=FLAT.INPUT.FILE,DISP=SHR
//OUTFILE  DD DSN=PROD.VSAM.KSDS,DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* LOAD VSAM FROM FLAT FILE */
  REPRO INFILE(INFILE) -
        OUTFILE(OUTFILE) -
        REPLACE
/*
//*
//STEP02   EXEC PGM=IDCAMS
//BACKUP   DD DSN=VSAM.BACKUP.FILE,
//            DISP=(NEW,CATLG),SPACE=(CYL,(100,50))
//VSAM     DD DSN=PROD.VSAM.KSDS,DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* BACKUP VSAM TO FLAT FILE */
  REPRO INFILE(VSAM) -
        OUTFILE(BACKUP)
/*
//*
//STEP03   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* COPY VSAM TO VSAM WITH SELECTION */
  REPRO INDATASET(PROD.VSAM.SOURCE) -
        OUTDATASET(PROD.VSAM.TARGET) -
        FROMKEY(1000000000) -
        TOKEY(1999999999) -
        REPLACE
/*`}
          language="jcl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark">
            <h4 className="text-mainframe-green font-semibold mb-3">REPRO Options</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">REPLACE</code> - Replace duplicate keys</li>
              <li><code className="code-inline">NOREPLACE</code> - Skip duplicates</li>
              <li><code className="code-inline">REUSE</code> - Reuse target space</li>
              <li><code className="code-inline">FROMKEY/TOKEY</code> - Key range</li>
              <li><code className="code-inline">SKIP/COUNT</code> - Record selection</li>
            </ul>
          </div>
          
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-3">File Specifications</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><code className="code-inline">INFILE(ddname)</code> - Input DD</li>
              <li><code className="code-inline">OUTFILE(ddname)</code> - Output DD</li>
              <li><code className="code-inline">INDATASET(name)</code> - Input by name</li>
              <li><code className="code-inline">OUTDATASET(name)</code> - Output by name</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DELETE Command */}
      <section className="space-y-6">
        <h2 className="section-title">DELETE Command</h2>

        <CodeBlock
          title="DELETE Examples"
          code={`//DELETE   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* DELETE A VSAM CLUSTER */
  DELETE PROD.VSAM.CLUSTER -
         CLUSTER -
         PURGE
         
  /* DELETE WITH CONDITIONAL (no error if not found) */
  DELETE PROD.TEMP.FILE -
         CLUSTER -
         PURGE -
         NOERASE
         
  /* SET MAXCC TO PREVENT ABEND ON NOT FOUND */
  IF LASTCC = 8 THEN -
     SET MAXCC = 0
     
  /* DELETE GDG BASE AND ALL GENERATIONS */
  DELETE PROD.GDG.BASE -
         GDG -
         FORCE -
         PURGE
         
  /* DELETE NON-VSAM DATA SET */
  DELETE PROD.FLAT.FILE -
         NONVSAM -
         PURGE
/*`}
          language="jcl"
        />

        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-accent-orange flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-orange font-semibold mb-1">Production Warning</h4>
            <p className="text-gray-300 text-sm">
              The <code className="code-inline">PURGE</code> parameter bypasses retention periods. 
              Use with extreme caution in production environments. Always verify the data set name 
              before executing DELETE commands.
            </p>
          </div>
        </div>
      </section>

      {/* LISTCAT Command */}
      <section className="space-y-6">
        <h2 className="section-title">LISTCAT Command</h2>

        <CodeBlock
          title="LISTCAT Examples"
          code={`//LISTCAT  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* LIST CATALOG ENTRY WITH ALL DETAILS */
  LISTCAT ENTRIES(PROD.ACCT.MASTER) -
          ALL
          
  /* LIST ONLY NAME AND VOLUME */
  LISTCAT ENTRIES(PROD.ACCT.*) -
          NAME -
          VOLUME
          
  /* LIST CLUSTER STATISTICS */
  LISTCAT ENTRIES(PROD.VSAM.KSDS) -
          ALLOCATION -
          HISTORY -
          VOLUME
          
  /* LIST GDG AND ALL GENERATIONS */
  LISTCAT ENTRIES(PROD.GDG.BASE) -
          GDG -
          ALL
/*`}
          language="jcl"
        />
      </section>

      {/* ALTER Command */}
      <section className="space-y-6">
        <h2 className="section-title">ALTER Command</h2>

        <CodeBlock
          title="ALTER Examples"
          code={`//ALTER    EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* CHANGE FREESPACE */
  ALTER PROD.VSAM.KSDS -
        FREESPACE(30 15)
        
  /* CHANGE BUFFER SPACE */
  ALTER PROD.VSAM.KSDS -
        BUFFERSPACE(524288)
        
  /* CHANGE SHAREOPTIONS */
  ALTER PROD.VSAM.KSDS -
        SHAREOPTIONS(2 3)
        
  /* RENAME A CLUSTER */
  ALTER PROD.VSAM.OLD -
        NEWNAME(PROD.VSAM.NEW)
        
  /* CHANGE EXPIRATION */
  ALTER PROD.VSAM.KSDS -
        TO(2025365)
/*`}
          language="jcl"
        />
      </section>

      {/* PRINT Command */}
      <section className="space-y-6">
        <h2 className="section-title">PRINT Command</h2>

        <CodeBlock
          title="PRINT Examples"
          code={`//PRINT    EXEC PGM=IDCAMS
//VSAMFILE DD DSN=PROD.VSAM.KSDS,DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  /* PRINT ALL RECORDS IN CHARACTER FORMAT */
  PRINT INFILE(VSAMFILE) -
        CHARACTER
        
  /* PRINT WITH KEY RANGE */
  PRINT INFILE(VSAMFILE) -
        FROMKEY(1000000000) -
        TOKEY(1000000099) -
        CHARACTER
        
  /* PRINT IN HEX FORMAT */
  PRINT INDATASET(PROD.VSAM.KSDS) -
        HEX -
        COUNT(10)
        
  /* PRINT DUMP FORMAT (HEX + CHAR) */
  PRINT INFILE(VSAMFILE) -
        DUMP -
        SKIP(100) -
        COUNT(50)
/*`}
          language="jcl"
        />
      </section>

      {/* Alternate Index */}
      <section className="space-y-6">
        <h2 className="section-title">Alternate Indexes</h2>
        
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-accent-cyan">Alternate indexes</strong> allow accessing KSDS records 
          by fields other than the primary key. Essential for customer lookup by SSN, account by name, etc.
        </p>

        <CodeBlock
          title="Create and Build Alternate Index"
          code={`//ALTINDEX JOB (ACCT),'ALT INDEX',CLASS=A
//*
//* STEP 1: DEFINE THE ALTERNATE INDEX
//*
//DEFAIX   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE ALTERNATEINDEX -
         (NAME(PROD.ACCT.MASTER.AIX.SSN) -
          RELATE(PROD.ACCT.MASTER) -
          KEYS(9 50) -
          RECORDSIZE(60 200) -
          NONUNIQUEKEY -
          UPGRADE -
          SHAREOPTIONS(2 3)) -
         DATA -
          (NAME(PROD.ACCT.MASTER.AIX.SSN.DATA) -
           CYLINDERS(10 5)) -
         INDEX -
          (NAME(PROD.ACCT.MASTER.AIX.SSN.INDEX) -
           CYLINDERS(2 1))
/*
//*
//* STEP 2: BUILD THE ALTERNATE INDEX
//*
//BLDAIX   EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  BLDINDEX INDATASET(PROD.ACCT.MASTER) -
           OUTDATASET(PROD.ACCT.MASTER.AIX.SSN)
/*
//*
//* STEP 3: DEFINE PATH FOR ACCESS
//*
//DEFPATH  EXEC PGM=IDCAMS
//SYSPRINT DD SYSOUT=*
//SYSIN    DD *
  DEFINE PATH -
         (NAME(PROD.ACCT.MASTER.PATH.SSN) -
          PATHENTRY(PROD.ACCT.MASTER.AIX.SSN) -
          UPDATE)
/*`}
          language="jcl"
        />

        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4 flex gap-3">
          <Info className="text-accent-cyan flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-accent-cyan font-semibold mb-1">Alternate Index Usage</h4>
            <p className="text-gray-300 text-sm">
              Access the base cluster through the PATH to use the alternate key. The 
              <code className="code-inline">UPGRADE</code> option automatically maintains the AIX 
              when the base cluster is updated. <code className="code-inline">NONUNIQUEKEY</code> 
              allows multiple records with the same alternate key.
            </p>
          </div>
        </div>
      </section>

      {/* JCL for VSAM Access */}
      <section className="space-y-6">
        <h2 className="section-title">JCL for VSAM Access</h2>

        <CodeBlock
          title="VSAM DD Statements"
          code={`//VSAMJOB  JOB (ACCT),'VSAM ACCESS',CLASS=A
//STEP01   EXEC PGM=VSAMPROC
//*
//* BASIC VSAM ACCESS
//MASTER   DD DSN=PROD.ACCT.MASTER,DISP=SHR
//*
//* VSAM WITH AMP PARAMETER (Advanced)
//ACCOUNTS DD DSN=PROD.ACCT.MASTER,DISP=SHR,
//            AMP=('BUFNI=10,BUFND=20')
//*
//* ACCESS VIA ALTERNATE INDEX PATH
//BYSSN    DD DSN=PROD.ACCT.MASTER.PATH.SSN,DISP=SHR
//*
//* DEFINE VSAM IN JCL (TEMPORARY)
//TEMPVSAM DD DSN=&&TEMP,
//            DISP=(NEW,DELETE),
//            SPACE=(CYL,(10,5)),
//            DCB=(RECFM=VB,LRECL=500,KEYLEN=10,KEYOFF=0),
//            RECORG=KS
//*
//* VSAM FOR UPDATE (EXCLUSIVE)
//UPDATE   DD DSN=PROD.ACCT.MASTER,DISP=OLD`}
          language="jcl"
        />
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-mainframe-amber/20">
        <Link
          to="/module/4"
          className="flex items-center gap-2 text-gray-400 hover:text-mainframe-amber transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 4: Procedures</span>
        </Link>
        <Link
          to="/module/6"
          className="btn-primary inline-flex items-center gap-2"
        >
          Module 6: Utilities
          <ArrowRight size={18} />
        </Link>
      </nav>
    </div>
  )
}

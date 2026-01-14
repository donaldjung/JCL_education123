import { useState } from 'react'
import { Search, BookOpen } from 'lucide-react'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
  related?: string[]
}

const glossaryTerms: GlossaryTerm[] = [
  // JCL Terms
  { term: 'JCL', definition: 'Job Control Language - the command language used to communicate with IBM z/OS systems, specifying what programs to run and what resources to use.', category: 'JCL', related: ['Job', 'JES'] },
  { term: 'JOB', definition: 'A unit of work submitted for execution on z/OS. Every batch job begins with a JOB statement that identifies and provides accounting information.', category: 'JCL', related: ['Step', 'JES'] },
  { term: 'Step', definition: 'A unit of work within a job, consisting of an EXEC statement and associated DD statements. A job can contain multiple steps.', category: 'JCL', related: ['JOB', 'EXEC'] },
  { term: 'DD Statement', definition: 'Data Definition statement that describes a data set to be used by a program, including its name, disposition, and physical characteristics.', category: 'JCL', related: ['DSN', 'DISP', 'DCB'] },
  { term: 'EXEC Statement', definition: 'Execute statement that identifies which program or procedure to run for a job step.', category: 'JCL', related: ['PGM', 'PROC', 'PARM'] },
  { term: 'PROC', definition: 'Procedure - a set of JCL statements that can be stored in a library and invoked by name, promoting reuse and standardization.', category: 'JCL', related: ['Cataloged PROC', 'In-stream PROC'] },
  { term: 'Symbolic Parameter', definition: 'A variable in a procedure that can be assigned a value when the procedure is invoked, allowing customization without modifying the PROC.', category: 'JCL', related: ['PROC', 'SET'] },
  { term: 'Continuation', definition: 'Continuing a JCL statement across multiple lines. A non-blank character in column 72 indicates continuation to the next line.', category: 'JCL' },
  { term: 'Return Code', definition: 'A numeric value (0-4095) set by a program indicating its completion status. RC=0 typically means success, higher values indicate warnings or errors.', category: 'JCL', related: ['COND', 'IF/THEN/ELSE'] },
  { term: 'COND', definition: 'Condition parameter used to bypass step execution based on return codes from previous steps. Note: COND tests when to skip, not when to run.', category: 'JCL', related: ['Return Code', 'IF/THEN/ELSE'] },
  
  // z/OS & System Terms
  { term: 'z/OS', definition: 'IBM\'s flagship mainframe operating system, designed for high-volume transaction processing and enterprise workloads.', category: 'z/OS', related: ['MVS', 'JES'] },
  { term: 'MVS', definition: 'Multiple Virtual Storage - the predecessor to z/OS. The term is still commonly used to refer to z/OS concepts.', category: 'z/OS', related: ['z/OS'] },
  { term: 'JES', definition: 'Job Entry Subsystem - manages the input, scheduling, and output processing of batch jobs. JES2 and JES3 are the two versions.', category: 'z/OS', related: ['JES2', 'JES3', 'Spool'] },
  { term: 'JES2', definition: 'The more commonly used Job Entry Subsystem, handling job input, scheduling, and output on most z/OS systems.', category: 'z/OS', related: ['JES', 'Initiator'] },
  { term: 'Initiator', definition: 'A system address space that selects jobs from the JES queue and executes them. Jobs are assigned to initiators based on CLASS.', category: 'z/OS', related: ['CLASS', 'JES'] },
  { term: 'SPOOL', definition: 'Simultaneous Peripheral Operations OnLine - temporary storage used by JES for job input and output data.', category: 'z/OS', related: ['JES', 'SYSOUT'] },
  { term: 'TSO', definition: 'Time Sharing Option - an interactive environment on z/OS for developing and testing programs, editing data sets, and submitting jobs.', category: 'z/OS', related: ['ISPF'] },
  { term: 'ISPF', definition: 'Interactive System Productivity Facility - a full-screen interface for TSO providing menus, panels, and an editor for z/OS work.', category: 'z/OS', related: ['TSO'] },
  { term: 'Catalog', definition: 'A system data set that maintains the relationships between data set names and their physical locations on volumes.', category: 'z/OS', related: ['ICF Catalog', 'CATLG'] },
  { term: 'DASD', definition: 'Direct Access Storage Device - magnetic disk storage on mainframes. The most common type is the 3390.', category: 'z/OS', related: ['Volume', '3390'] },
  { term: 'Volume', definition: 'A physical or logical unit of storage, identified by a VOLSER (volume serial number).', category: 'z/OS', related: ['DASD', 'VOLSER'] },
  { term: 'SMS', definition: 'Storage Management Subsystem - automates and centralizes storage management using data class, storage class, and management class definitions.', category: 'z/OS', related: ['STORCLAS', 'DATACLAS'] },
  
  // Data Set Terms
  { term: 'Data Set', definition: 'A file on z/OS, identified by a 1-44 character name using periods as qualifiers. The basic unit of data storage.', category: 'Data Sets', related: ['DSN', 'PS', 'PDS'] },
  { term: 'PS', definition: 'Physical Sequential - a data set organization where records are stored and accessed sequentially.', category: 'Data Sets', related: ['QSAM', 'Sequential'] },
  { term: 'PDS', definition: 'Partitioned Data Set - a data set containing multiple members, like a directory of files. Used for JCL, source code, and load modules.', category: 'Data Sets', related: ['PDSE', 'Member', 'Directory'] },
  { term: 'PDSE', definition: 'Partitioned Data Set Extended - an improved version of PDS with dynamic directory expansion and better member management.', category: 'Data Sets', related: ['PDS', 'DSNTYPE=LIBRARY'] },
  { term: 'GDG', definition: 'Generation Data Group - a collection of chronologically related data sets sharing a base name, with each generation identified by a relative number.', category: 'Data Sets', related: ['Generation', 'GDG Base'] },
  { term: 'DSN', definition: 'Data Set Name - the fully qualified name identifying a data set, up to 44 characters with period-separated qualifiers.', category: 'Data Sets', related: ['Data Set', 'HLQ'] },
  { term: 'HLQ', definition: 'High Level Qualifier - the first qualifier in a data set name, typically identifying the owner, application, or environment.', category: 'Data Sets', related: ['DSN'] },
  { term: 'DISP', definition: 'Disposition - specifies the status of a data set and what to do with it after the job step completes (normal and abnormal end).', category: 'Data Sets', related: ['NEW', 'OLD', 'SHR', 'MOD'] },
  { term: 'DCB', definition: 'Data Control Block - describes the physical characteristics of a data set including record format, length, and block size.', category: 'Data Sets', related: ['RECFM', 'LRECL', 'BLKSIZE'] },
  { term: 'RECFM', definition: 'Record Format - specifies how records are organized: F (fixed), V (variable), FB (fixed blocked), VB (variable blocked), U (undefined).', category: 'Data Sets', related: ['DCB', 'LRECL'] },
  { term: 'LRECL', definition: 'Logical Record Length - the length of each logical record in a data set, in bytes.', category: 'Data Sets', related: ['DCB', 'RECFM'] },
  { term: 'BLKSIZE', definition: 'Block Size - the physical block size for I/O operations. BLKSIZE=0 allows the system to calculate optimal blocking.', category: 'Data Sets', related: ['DCB', 'Half-track'] },
  
  // VSAM Terms
  { term: 'VSAM', definition: 'Virtual Storage Access Method - IBM\'s high-performance file access method supporting indexed, sequential, and relative record organization.', category: 'VSAM', related: ['KSDS', 'ESDS', 'RRDS'] },
  { term: 'KSDS', definition: 'Key Sequenced Data Set - a VSAM data set where records are stored and retrieved by a primary key, with an index structure.', category: 'VSAM', related: ['VSAM', 'Primary Key', 'AIX'] },
  { term: 'ESDS', definition: 'Entry Sequenced Data Set - a VSAM data set where records are stored in the order they are written (sequential).', category: 'VSAM', related: ['VSAM'] },
  { term: 'RRDS', definition: 'Relative Record Data Set - a VSAM data set where records are accessed by their relative slot position.', category: 'VSAM', related: ['VSAM'] },
  { term: 'LDS', definition: 'Linear Data Set - a VSAM data set used as a byte-stream container, commonly for DB2 tablespaces.', category: 'VSAM', related: ['VSAM', 'DB2'] },
  { term: 'IDCAMS', definition: 'Access Method Services - the utility program for defining, managing, and maintaining VSAM and catalog structures.', category: 'VSAM', related: ['VSAM', 'DEFINE CLUSTER'] },
  { term: 'Cluster', definition: 'A VSAM data set comprising data and (for KSDS) index components, defined and managed as a single entity.', category: 'VSAM', related: ['VSAM', 'DEFINE CLUSTER'] },
  { term: 'CI', definition: 'Control Interval - the unit of data transfer between VSAM and virtual storage. The size affects performance.', category: 'VSAM', related: ['CA', 'CISIZE'] },
  { term: 'CA', definition: 'Control Area - a group of control intervals. VSAM allocates space in control area increments.', category: 'VSAM', related: ['CI', 'FREESPACE'] },
  { term: 'AIX', definition: 'Alternate Index - allows access to KSDS records using a key field other than the primary key.', category: 'VSAM', related: ['KSDS', 'PATH', 'BLDINDEX'] },
  
  // Utility Terms
  { term: 'IEFBR14', definition: 'A "do nothing" utility program used to allocate, delete, or catalog data sets via DD statements without any processing.', category: 'Utilities', related: ['DD Statement'] },
  { term: 'IEBGENER', definition: 'General purpose copy utility for sequential data sets and PDS members.', category: 'Utilities', related: ['Copy', 'SYSUT1', 'SYSUT2'] },
  { term: 'IEBCOPY', definition: 'PDS copy, compress, and maintenance utility. Copies members between partitioned data sets.', category: 'Utilities', related: ['PDS', 'Compress'] },
  { term: 'DFSORT', definition: 'IBM\'s high-performance sort/merge utility, also called SORT or ICEMAN. Sorts, merges, copies, and transforms data.', category: 'Utilities', related: ['SORT', 'ICETOOL'] },
  { term: 'ICETOOL', definition: 'DFSORT tool for performing multiple sort/copy operations and generating reports in a single job step.', category: 'Utilities', related: ['DFSORT'] },
  { term: 'SORT', definition: 'Generic term for sorting utilities (DFSORT, SYNCSORT). Reorders records based on specified key fields.', category: 'Utilities', related: ['DFSORT', 'SORT FIELDS'] },
  
  // Financial Terms
  { term: 'EOD', definition: 'End of Day - the batch processing cycle that closes business for the day, posts transactions, and prepares for the next business day.', category: 'Financial', related: ['Batch Window', 'GL'] },
  { term: 'Batch Window', definition: 'The time period (typically overnight) when batch jobs run, between online system closeout and the next business day opening.', category: 'Financial', related: ['EOD', 'SLA'] },
  { term: 'GL', definition: 'General Ledger - the master accounting record. GL interface jobs extract and post transaction summaries.', category: 'Financial', related: ['EOD', 'GL Extract'] },
  { term: 'CTR', definition: 'Currency Transaction Report - regulatory filing required for cash transactions exceeding $10,000 (FinCEN requirement).', category: 'Financial', related: ['SAR', 'Regulatory'] },
  { term: 'SAR', definition: 'Suspicious Activity Report - regulatory filing for transactions that may indicate money laundering or fraud.', category: 'Financial', related: ['CTR', 'Regulatory'] },
  { term: 'Reconciliation', definition: 'The process of comparing internal records with external sources to ensure accuracy and identify discrepancies.', category: 'Financial', related: ['EOD', 'Balancing'] },
  { term: 'Audit Trail', definition: 'A chronological record of all changes to data, required for regulatory compliance and investigation.', category: 'Financial', related: ['GDG', 'Archive'] },
]

const categories = [...new Set(glossaryTerms.map(t => t.category))]

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTerms = glossaryTerms
    .filter(term => 
      (selectedCategory === null || term.category === selectedCategory) &&
      (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
       term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, GlossaryTerm[]>)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-mainframe-amber/10 flex items-center justify-center border border-mainframe-amber/30">
            <BookOpen className="text-mainframe-amber" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">JCL & z/OS Glossary</h1>
            <p className="text-gray-400">Comprehensive terminology reference</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-mainframe-terminal border border-mainframe-amber/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-mainframe-amber/50 focus:ring-1 focus:ring-mainframe-amber/30 transition-all font-mono text-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-mainframe-amber text-mainframe-dark'
                : 'bg-mainframe-terminal text-gray-400 hover:text-mainframe-amber border border-mainframe-amber/20'
            }`}
          >
            All ({glossaryTerms.length})
          </button>
          {categories.map(category => {
            const count = glossaryTerms.filter(t => t.category === category).length
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-mainframe-amber text-mainframe-dark'
                    : 'bg-mainframe-terminal text-gray-400 hover:text-mainframe-amber border border-mainframe-amber/20'
                }`}
              >
                {category} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredTerms.length} of {glossaryTerms.length} terms
      </div>

      {/* Glossary Terms */}
      <div className="space-y-8">
        {Object.entries(groupedTerms).map(([letter, terms]) => (
          <section key={letter}>
            <div className="sticky top-16 z-10 bg-mainframe-dark/95 backdrop-blur-sm py-2 mb-4">
              <h2 className="text-2xl font-display font-bold text-mainframe-amber">{letter}</h2>
            </div>
            <div className="space-y-4">
              {terms.map((term) => (
                <div key={term.term} className="card-dark group hover:border-mainframe-amber/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-mainframe-amber transition-colors">
                          {term.term}
                        </h3>
                        <span className="px-2 py-0.5 bg-mainframe-terminal text-xs text-gray-500 rounded font-mono">
                          {term.category}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{term.definition}</p>
                      {term.related && term.related.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-500">Related:</span>
                          <div className="flex flex-wrap gap-1">
                            {term.related.map(rel => (
                              <button
                                key={rel}
                                onClick={() => setSearchTerm(rel)}
                                className="px-2 py-0.5 bg-mainframe-dark text-xs text-mainframe-amber/70 rounded hover:text-mainframe-amber hover:bg-mainframe-amber/10 transition-all"
                              >
                                {rel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* No results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No terms found matching "{searchTerm}"</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory(null)
            }}
            className="mt-4 text-mainframe-amber hover:text-mainframe-amber/80"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Alphabet Jump */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-1">
        {Object.keys(groupedTerms).map(letter => (
          <a
            key={letter}
            href={`#${letter}`}
            className="w-6 h-6 flex items-center justify-center text-xs font-mono text-gray-500 hover:text-mainframe-amber hover:bg-mainframe-amber/10 rounded transition-all"
          >
            {letter}
          </a>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Database, 
  Play, 
  FolderCog, 
  HardDrive, 
  Wrench, 
  Building2,
  Terminal,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

const modules = [
  {
    id: 1,
    title: 'JCL Fundamentals',
    description: 'Master JOB statements, basic syntax, and job structure',
    icon: BookOpen,
    color: 'mainframe-amber',
    topics: ['JOB Statement', 'JCL Syntax Rules', 'Job Streams'],
  },
  {
    id: 2,
    title: 'DD Statements',
    description: 'Data Definition statements, DSN, DISP, DCB, and SPACE',
    icon: Database,
    color: 'mainframe-green',
    topics: ['DSN Parameter', 'DISP Subparameters', 'DCB Attributes'],
  },
  {
    id: 3,
    title: 'EXEC Statement',
    description: 'Program execution, PGM, PARM, and COND parameters',
    icon: Play,
    color: 'accent-cyan',
    topics: ['PGM Parameter', 'PARM Values', 'COND Codes'],
  },
  {
    id: 4,
    title: 'Procedures',
    description: 'Cataloged and in-stream PROCs, symbolic parameters',
    icon: FolderCog,
    color: 'accent-orange',
    topics: ['PROC Statement', 'Symbolic Parameters', 'JCLLIB'],
  },
  {
    id: 5,
    title: 'VSAM & IDCAMS',
    description: 'VSAM file access and IDCAMS utility commands',
    icon: HardDrive,
    color: 'mainframe-amber',
    topics: ['VSAM Types', 'DEFINE CLUSTER', 'REPRO/PRINT'],
  },
  {
    id: 6,
    title: 'Utilities',
    description: 'IEBGENER, IEBCOPY, SORT, and other z/OS utilities',
    icon: Wrench,
    color: 'mainframe-green',
    topics: ['IEBGENER', 'DFSORT', 'IEFBR14'],
  },
  {
    id: 7,
    title: 'Financial Patterns',
    description: 'JCL patterns for financial batch processing',
    icon: Building2,
    color: 'accent-cyan',
    topics: ['EOD Processing', 'GL Extracts', 'Regulatory Reports'],
  },
]

const features = [
  {
    icon: Terminal,
    title: 'Interactive Playground',
    description: 'Write and validate JCL syntax in real-time with instant feedback',
  },
  {
    icon: Zap,
    title: 'Real-World Examples',
    description: 'Learn from actual financial industry JCL patterns and best practices',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Master JCL techniques used in enterprise z/OS environments',
  },
  {
    icon: Clock,
    title: 'Batch Processing',
    description: 'Understand job scheduling, dependencies, and restart/recovery',
  },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="relative py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-mainframe-amber/5 via-transparent to-accent-cyan/5 rounded-3xl" />
        
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-mainframe-amber/10 rounded-full border border-mainframe-amber/30">
              <div className="w-2 h-2 rounded-full bg-mainframe-amber animate-pulse" />
              <span className="text-mainframe-amber text-sm font-mono">IBM z/OS Mainframe</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Master{' '}
              <span className="text-mainframe-amber glow-amber">JCL</span>
              <br />
              Job Control Language
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed">
              The comprehensive guide to IBM z/OS Job Control Language for financial 
              institutions. From fundamentals to advanced batch processing patterns 
              used in production environments.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/module/1" className="btn-primary inline-flex items-center gap-2">
                Start Learning
                <ArrowRight size={18} />
              </Link>
              <Link to="/playground" className="btn-secondary inline-flex items-center gap-2">
                <Terminal size={18} />
                Try Playground
              </Link>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-mainframe-amber">7</div>
                <div className="text-sm text-gray-500">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-mainframe-green">50+</div>
                <div className="text-sm text-gray-500">Examples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-accent-cyan">100%</div>
                <div className="text-sm text-gray-500">Practical</div>
              </div>
            </div>
          </div>
          
          {/* Hero Code Block */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-3 text-gray-400 text-sm font-mono">SAMPLE.JCL</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <pre className="text-gray-300 leading-relaxed">
{`//`}<span className="text-mainframe-amber font-bold">BANKJOB</span>{`  JOB (ACCT),'DAILY BATCH',
//         CLASS=A,MSGCLASS=X,
//         NOTIFY=&SYSUID
//*
//* FINANCIAL BATCH PROCESS
//*
//`}<span className="text-mainframe-green">STEP010</span>{`  EXEC PGM=`}<span className="text-accent-cyan">ACCTPROC</span>{`
//INFILE   DD DSN=BANK.TRANS.DAILY,
//            DISP=SHR
//OUTFILE  DD DSN=BANK.TRANS.SORTED,
//            DISP=(NEW,CATLG,DELETE),
//            SPACE=(CYL,(100,50),RLSE),
//            DCB=(RECFM=FB,LRECL=200)
//SYSPRINT DD SYSOUT=*`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="section-title text-center mb-12">Why Learn JCL?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card-dark group hover:border-mainframe-amber/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-mainframe-amber/10 flex items-center justify-center mb-4 group-hover:bg-mainframe-amber/20 transition-all">
                <feature.icon className="text-mainframe-amber" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title mb-0">Learning Modules</h2>
          <Link to="/cheatsheet" className="text-mainframe-amber hover:text-mainframe-amber/80 flex items-center gap-2 text-sm">
            View Cheat Sheet
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={`/module/${module.id}`}
              className="card-highlight group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-${module.color}/10 flex items-center justify-center flex-shrink-0 group-hover:bg-${module.color}/20 transition-all`}>
                  <module.icon className={`text-${module.color}`} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">Module {module.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-mainframe-amber transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-mainframe-dark rounded text-xs text-gray-500 font-mono"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8">
        <div className="card-highlight gradient-border text-center py-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Master Mainframe JCL?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start with the fundamentals and progress through real-world financial 
            industry patterns. Build the skills needed for enterprise batch processing.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/module/1" className="btn-primary inline-flex items-center gap-2">
              Begin Module 1
              <ArrowRight size={18} />
            </Link>
            <Link to="/glossary" className="btn-secondary">
              Browse Glossary
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

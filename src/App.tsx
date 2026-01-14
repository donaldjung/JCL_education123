import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Module1_Fundamentals from './pages/modules/Module1_Fundamentals'
import Module2_DDStatements from './pages/modules/Module2_DDStatements'
import Module3_EXEC from './pages/modules/Module3_EXEC'
import Module4_Procedures from './pages/modules/Module4_Procedures'
import Module5_VSAM from './pages/modules/Module5_VSAM'
import Module6_Utilities from './pages/modules/Module6_Utilities'
import Module7_FinancialPatterns from './pages/modules/Module7_FinancialPatterns'
import Playground from './pages/Playground'
import CheatSheet from './pages/CheatSheet'
import Glossary from './pages/Glossary'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/module/1" element={<Module1_Fundamentals />} />
          <Route path="/module/2" element={<Module2_DDStatements />} />
          <Route path="/module/3" element={<Module3_EXEC />} />
          <Route path="/module/4" element={<Module4_Procedures />} />
          <Route path="/module/5" element={<Module5_VSAM />} />
          <Route path="/module/6" element={<Module6_Utilities />} />
          <Route path="/module/7" element={<Module7_FinancialPatterns />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

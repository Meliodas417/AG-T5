import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import APIData from './pages/APIData';
import KPIHistory from './pages/KPIHistory';
import LanguageSwitcher from './components/LanguageSwitcher';  // 引入 LanguageSwitcher 组件

function App() {
  return (
    <Router>
      <div className="container mx-auto p-8">
        {/* 顶部导航栏 */}
        <nav className="mb-4 flex justify-between items-center">
          <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/api-data">API Data Import</Link></li>
            <li><Link to="/history">KPI History</Link></li>
          </ul>

          {/* 放置语言切换组件 */}
          <LanguageSwitcher />
        </nav>

        {/* 路由定义 */}
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/api-data" element={<APIData />} />
          <Route path="/history" element={<KPIHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

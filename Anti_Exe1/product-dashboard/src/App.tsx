import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RequirementList from './components/RequirementList';
import RequirementForm from './components/RequirementForm';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'list':
        return <RequirementList />;
      case 'form':
        return <RequirementForm onSuccess={() => setActiveTab('list')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto px-10">
        <div className="max-w-7xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;

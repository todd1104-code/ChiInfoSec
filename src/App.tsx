import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Investigation from './pages/Investigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('today');
  const [notifications, setNotifications] = useState<{id: number, msg: string, time: Date}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard dateRange={dateRange} setNotifications={setNotifications} />;
      case 'alerts': return <Alerts />;
      case 'analytics': return <Analytics />;
      case 'investigation': return <Investigation />;
      default: return <Dashboard dateRange={dateRange} setNotifications={setNotifications} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      dateRange={dateRange}
      setDateRange={setDateRange}
      notifications={notifications}
      setNotifications={setNotifications}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
    >
      {renderContent()}
    </Layout>
  );
}

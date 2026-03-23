import { ShieldAlert, Home, Bell, PieChart, Search, Menu, Settings, Moon, Sun, Info, X, Calendar, AlertTriangle, LayoutDashboard, FileSearch } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab,
  dateRange,
  setDateRange,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications
}: { 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  dateRange: string,
  setDateRange: (range: string) => void,
  notifications: {id: number, msg: string, time: Date}[],
  setNotifications: React.Dispatch<React.SetStateAction<{id: number, msg: string, time: Date}[]>>,
  showNotifications: boolean,
  setShowNotifications: (show: boolean) => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
    { id: 'alerts', label: '警報', icon: AlertTriangle },
    { id: 'analytics', label: '分析', icon: PieChart },
    { id: 'investigation', label: '調查', icon: FileSearch },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-indigo-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-1.5 hover:bg-indigo-800 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-wide">資安管家</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'dashboard' && (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)} 
                className="pl-9 pr-4 py-1.5 bg-indigo-800/50 dark:bg-slate-800 border border-indigo-700 dark:border-slate-700 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="today" className="text-slate-900 dark:text-slate-100">今日</option>
                <option value="7days" className="text-slate-900 dark:text-slate-100">近 7 天</option>
                <option value="30days" className="text-slate-900 dark:text-slate-100">近 30 天</option>
              </select>
            </div>
          )}
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-indigo-800/50 dark:bg-slate-800 border border-indigo-700 dark:border-slate-700 rounded-lg text-white hover:bg-indigo-700 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notifications.length > 99 ? '99+' : notifications.length}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 text-slate-900">通知中心</span>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">全部清除</button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">目前沒有新通知</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.msg}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.time.toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Side Drawer (Top-Left Menu) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-5 bg-indigo-900 dark:bg-slate-950 text-white flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-6 h-6 text-indigo-400" />
                  <span className="font-bold text-lg">設定與選單</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-indigo-800 dark:hover:bg-slate-800 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                <button className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">伺服器設定</span>
                </button>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
                  <span className="font-medium text-slate-700 dark:text-slate-200">{isDarkMode ? '切換淺色模式' : '切換深色模式'}</span>
                </button>
                <button className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">關於</span>
                </button>
              </nav>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-400">
                正航資安管家 v1.0.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-3xl mx-auto min-h-full pb-32"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation (App-like) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1115] border-t border-slate-200 dark:border-slate-800/50 flex justify-around items-center pb-safe pt-2 px-2 z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-[76px] h-[64px] rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-sky-50 dark:bg-[#1e232d] text-sky-600 dark:text-sky-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-sky-600/20 dark:fill-sky-400/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

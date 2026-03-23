import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Activity, X, Users, LogIn, TrendingUp, MonitorSmartphone, CheckCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Mock Data Generators ---
const getMockData = (range: string) => {
  let multiplier = 1;
  let highRisk = 3;
  let mediumRisk = 12;
  let logins = 2845;

  if (range === '7days') {
    multiplier = 7;
    highRisk = 15;
    mediumRisk = 65;
    logins = 19540;
  } else if (range === '30days') {
    multiplier = 30;
    highRisk = 45;
    mediumRisk = 210;
    logins = 85400;
  }

  return {
    logins,
    highRisk,
    mediumRisk,
    hotFunctions: [
      { name: '建立採購單', value: 4000 * multiplier, color: '#6366f1' },
      { name: '薪資結算', value: 3000 * multiplier, color: '#8b5cf6' },
      { name: '傳票審核', value: 2000 * multiplier, color: '#ec4899' },
      { name: '庫存盤點', value: 2780 * multiplier, color: '#14b8a6' },
      { name: '權限變更', value: 1890 * multiplier, color: '#f59e0b' },
    ],
    trend: Array.from({ length: 7 }).map((_, i) => ({
      date: `03/${14 + i}`,
      volume: Math.floor(Math.random() * 5000 * multiplier) + 10000 * multiplier
    })),
    source: [
      { name: 'Web', value: 65, color: '#3b82f6' },
      { name: '手機', value: 25, color: '#10b981' },
      { name: '客戶端', value: 10, color: '#8b5cf6' },
    ]
  };
};

export default function Dashboard({ dateRange, setNotifications }: { dateRange: string, setNotifications: React.Dispatch<React.SetStateAction<{id: number, msg: string, time: Date}[]>> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(getMockData(dateRange));
  const [detailModal, setDetailModal] = useState<{ title: string, type: string, payload?: any } | null>(null);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: 'error'|'success'|'info'}[]>([]);

  // 1. Date Range & 6. Skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(getMockData(dateRange));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  // 2. Real-time Simulation & 7. Toasts
  useEffect(() => {
    const interval = setInterval(() => {
      if (dateRange !== 'today') return; // Only simulate for 'today'
      
      // Randomly increment logins
      setData(prev => ({ ...prev, logins: prev.logins + Math.floor(Math.random() * 3) }));

      // Randomly trigger anomaly (10% chance every 5s)
      if (Math.random() > 0.9) {
        const newId = Date.now();
        const msg = '偵測到新異常登入行為';
        setToasts(prev => [...prev, { id: newId, msg, type: 'error' }]);
        setNotifications(prev => [{ id: newId, msg, time: new Date() }, ...prev]);
        setData(prev => ({ ...prev, highRisk: prev.highRisk + 1 }));
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newId));
        }, 4000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [dateRange]);

  // Score Calculation
  const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : 30;
  const avgHighRisk = data.highRisk / days;
  const avgMediumRisk = data.mediumRisk / days;
  
  const accessScore = Math.max(0, Math.round(100 - (avgHighRisk * 8)));
  const integrityScore = Math.max(0, Math.round(100 - (avgMediumRisk * 3)));
  const complianceScore = Math.max(0, Math.round(100 - (avgHighRisk * 4) - (avgMediumRisk * 2)));
  
  const securityScore = Math.round((accessScore + integrityScore + complianceScore) / 3);
  
  const getStatus = (score: number) => score >= 90 ? '良好' : score >= 75 ? '注意' : '警告';
  const getStatusColor = (score: number) => score >= 90 ? 'text-emerald-500' : score >= 75 ? 'text-amber-500' : 'text-red-500';

  const circumference = 2 * Math.PI * 66;
  const strokeDashoffset = circumference - (securityScore / 100) * circumference;
  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-teal-500 dark:text-teal-400', stroke: '#2dd4bf', label: 'SECURE' };
    if (score >= 60) return { text: 'text-amber-500 dark:text-amber-400', stroke: '#fbbf24', label: 'WARNING' };
    return { text: 'text-red-500 dark:text-red-400', stroke: '#ef4444', label: 'DANGER' };
  };
  const scoreStyle = getScoreColor(securityScore);

  // Helper for skeleton class
  const skelClass = isLoading ? 'animate-pulse bg-slate-200 dark:bg-slate-700 text-transparent rounded' : '';

  return (
    <div className="space-y-6 relative">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-white ${t.type === 'error' ? 'bg-red-500' : t.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
              {t.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : t.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              <span className="font-medium">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score Card */}
        <div onClick={() => setDetailModal({ title: '系統資安評分明細', type: 'score' })} className="col-span-2 md:col-span-2 md:row-span-2 bg-white dark:bg-[#161618] rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
          <div className="w-full text-left mb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-wide">目前資安狀態</h3>
          </div>
          <div className={`relative w-44 h-44 flex items-center justify-center my-4 ${isLoading ? 'opacity-50 scale-95 transition-all' : 'opacity-100 scale-100 transition-all'}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="80" cy="80" r="66" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
              <circle cx="80" cy="80" r="66" fill="transparent" stroke={scoreStyle.stroke} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} filter="url(#glow)" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center mt-1">
              <span className={`text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight ${skelClass}`}>{securityScore}</span>
              <span className={`text-[10px] font-bold ${scoreStyle.text} tracking-[0.2em] mt-1 ${skelClass}`}>{scoreStyle.label}</span>
            </div>
          </div>
          <div className="w-full text-center mt-2">
            <p className={`text-sm text-slate-500 dark:text-slate-400 ${skelClass}`}>
              系統偵測到 {data.highRisk} 個高風險與 {data.mediumRisk} 個中風險異常。
            </p>
          </div>
        </div>

        {/* High Risk */}
        <div onClick={() => setDetailModal({ title: '高風險異常明細', type: 'high' })} className="col-span-1 md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center items-center text-center space-y-2 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-2xl font-bold text-slate-800 dark:text-slate-100 ${skelClass}`}>{data.highRisk}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">高風險異常</p>
          </div>
        </div>

        {/* Medium Risk */}
        <div onClick={() => setDetailModal({ title: '中風險異常明細', type: 'medium' })} className="col-span-1 md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center items-center text-center space-y-2 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-2xl font-bold text-slate-800 dark:text-slate-100 ${skelClass}`}>{data.mediumRisk}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">中風險異常</p>
          </div>
        </div>

        {/* Total Logins */}
        <div className="col-span-2 md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">登入總人數</p>
            <p className={`text-3xl font-bold text-slate-800 dark:text-slate-100 ${skelClass}`}>{data.logins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">操作量趨勢</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} onClick={(e) => e && e.activePayload && setDetailModal({ title: `趨勢詳情: ${e.activePayload[0].payload.date}`, type: 'chart', payload: e.activePayload[0].payload })}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }} itemStyle={{ color: '#fff' }} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="volume" name="操作量" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, cursor: 'pointer' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Features */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">熱門功能 Top 5</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hotFunctions} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={70} />
                <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Bar 
                  dataKey="value" 
                  name="操作量" 
                  radius={[0, 4, 4, 0]} 
                  cursor="pointer"
                  onClick={(data) => setDetailModal({ title: `功能操作排名: ${data.name}`, type: 'function', payload: data })}
                >
                  {data.hotFunctions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <MonitorSmartphone className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">來源分佈</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.source} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={40} 
                  outerRadius={70} 
                  paddingAngle={5} 
                  dataKey="value" 
                  nameKey="name" 
                  name="佔比" 
                  cursor="pointer"
                  onClick={(e) => e && setDetailModal({ title: `來源詳情: ${e.name}`, type: 'chart', payload: e })}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                  className="text-xs font-medium"
                >
                  {data.source.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{detailModal.title}</h3>
                <button onClick={() => setDetailModal(null)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                {detailModal.type === 'chart' && detailModal.payload && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">數值</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {detailModal.payload.value || detailModal.payload.volume}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      此為圖表下鑽的詳細資料展示區塊。您可以進一步串接 API 取得該項目的詳細清單或歷史紀錄。
                    </p>
                  </div>
                )}
                {detailModal.type === 'function' && detailModal.payload && (
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">此功能總操作量：<span className="font-bold text-indigo-600 dark:text-indigo-400">{detailModal.payload.value.toLocaleString()}</span></p>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">人員操作排名 TOP 10</h4>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">員工 {String.fromCharCode(65 + i)}</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{Math.floor(detailModal.payload.value * (0.3 - i * 0.02))} 次</span>
                      </div>
                    ))}
                  </div>
                )}
                {detailModal.type === 'high' && (
                  <div className="space-y-3">
                    {Array.from({ length: data.highRisk }).map((_, i) => (
                      <div key={i} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-red-700 dark:text-red-400 text-sm">異常行為檢測 #{i+1}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">剛剛</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                          <span className="flex items-center"><Users className="w-3 h-3 mr-1"/>未知使用者</span>
                          <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">192.168.x.x</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {detailModal.type === 'medium' && (
                  <div className="space-y-3">
                    {Array.from({ length: Math.min(data.mediumRisk, 5) }).map((_, i) => (
                      <div key={i} className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">可疑操作 #{i+1}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">今日</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                          <span className="flex items-center"><Users className="w-3 h-3 mr-1"/>內部員工</span>
                        </div>
                      </div>
                    ))}
                    {data.mediumRisk > 5 && <p className="text-center text-sm text-slate-500 mt-2">還有 {data.mediumRisk - 5} 筆紀錄...</p>}
                  </div>
                )}
                {detailModal.type === 'score' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-center py-2">
                      <div className={`relative flex items-center justify-center w-28 h-28 rounded-full bg-slate-50 dark:bg-slate-800/50 border-4 shadow-inner`} style={{ borderColor: scoreStyle.stroke }}>
                        <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{securityScore}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { item: '存取安全', score: accessScore, status: getStatus(accessScore), color: getStatusColor(accessScore) },
                        { item: '資料完整性', score: integrityScore, status: getStatus(integrityScore), color: getStatusColor(integrityScore) },
                        { item: '行為合規性', score: complianceScore, status: getStatus(complianceScore), color: getStatusColor(complianceScore) },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.item}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-base font-bold text-slate-800 dark:text-slate-100">{item.score}</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${item.color} bg-slate-100 dark:bg-slate-800`}>{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <button onClick={() => setDetailModal(null)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors cursor-pointer">
                  關閉明細
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

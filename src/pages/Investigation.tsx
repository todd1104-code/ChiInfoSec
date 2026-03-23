import React, { useState } from 'react';
import { Search, User, Clock, FileText, AlertTriangle, Shield, LogIn, Database, Info } from 'lucide-react';

const timelineData = [
  { id: 1, time: '14:30:22', action: '匯出資料', detail: '匯出 [客戶應收帳款明細表.xlsx] (共 2,450 筆)', ip: '192.168.1.105', risk: 'high', icon: Database },
  { id: 2, time: '14:28:15', action: '查詢報表', detail: '開啟 [客戶應收帳款明細表]', ip: '192.168.1.105', risk: 'low', icon: FileText },
  { id: 3, time: '13:15:00', action: '修改單據', detail: '修改採購單 [PO-20231025-001] 金額', ip: '192.168.1.105', risk: 'medium', icon: FileText },
  { id: 4, time: '13:12:45', action: '權限不足', detail: '嘗試存取 [系統參數設定] 遭拒 (Permission Denied)', ip: '192.168.1.105', risk: 'medium', icon: Shield },
  { id: 5, time: '13:10:12', action: '登入成功', detail: '系統登入成功', ip: '192.168.1.105', risk: 'low', icon: LogIn },
  { id: 6, time: '13:09:55', action: '登入失敗', detail: '密碼錯誤', ip: '192.168.1.105', risk: 'low', icon: AlertTriangle },
];

export default function Investigation() {
  const [searchQuery, setSearchQuery] = useState('A0124');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">調查中心</h2>
        
        <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="輸入關鍵字查詢..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
            
            {/* Tooltip for search fields */}
            <div className="absolute right-3.5 top-3 group cursor-help">
              <Info className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="font-bold mb-1 text-sm">支援查詢欄位：</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-200">
                  <li>員工代號 / 姓名</li>
                  <li>使用者帳號</li>
                  <li>IP 位址</li>
                  <li>事件名稱 (如：登入失敗)</li>
                  <li>模組名稱 (如：採購模組)</li>
                </ul>
              </div>
            </div>
          </div>
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* User Profile Header */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 border-b border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-slate-800 shadow-sm">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="王小明" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">王小明 (A0124)</h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-1">財務部 - 資深會計</p>
            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>最後登入: 今日 13:10:12</span>
              </div>
              <div className="flex items-center justify-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>過去 24 小時異常: 2 件</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full gap-2 mt-2">
            <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
              匯出報告
            </button>
            <button className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer">
              強制停權
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            過去 24 小時操作軌跡
          </h4>
          
          <div className={`relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6 transition-opacity duration-300 ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
            {timelineData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-800 flex items-center justify-center
                    ${item.risk === 'high' ? 'bg-red-500' : item.risk === 'medium' ? 'bg-amber-500' : 'bg-indigo-400'}`}
                  ></div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${item.risk === 'high' ? 'text-red-500' : item.risk === 'medium' ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.action}</span>
                        {item.risk === 'high' && <span className="px-1.5 py-0.5 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-medium">高風險</span>}
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{item.detail}</p>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center">
                      <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">IP: {item.ip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

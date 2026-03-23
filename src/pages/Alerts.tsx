import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Download, ShieldOff, CheckCircle, XCircle } from 'lucide-react';

const initialAlerts = [
  { id: 1, type: 'login_fail', title: '連續登入失敗', desc: '同一 IP 短時間內登入失敗 5 次', user: 'A0124 (王小明)', time: '10:23', risk: 'high', icon: ShieldOff },
  { id: 2, type: 'export', title: '大額敏感資料匯出', desc: '匯出客戶名單超過平日平均值 300%', user: 'B0032 (李大華)', time: '09:45', risk: 'high', icon: Download },
  { id: 3, type: 'off_hours', title: '非辦公時間操作', desc: '深夜 02:15 頻繁異動採購單', user: 'C0111 (陳小美)', time: '08:12', risk: 'medium', icon: Clock },
  { id: 4, type: 'geo', title: '異地同時登入', desc: '5分鐘內分別從台北與高雄登入', user: 'A0089 (林經理)', time: '昨日 23:40', risk: 'high', icon: MapPin },
  { id: 5, type: 'permission', title: '權限越級嘗試', desc: '大量 Permission Denied 錯誤 (人事模組)', user: 'D0455 (張專員)', time: '昨日 16:20', risk: 'medium', icon: AlertTriangle },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleAction = (id: number, action: 'suspend' | 'ignore') => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">即時告警清單</h2>
        <div className="flex space-x-2">
          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">高風險: {alerts.filter(a => a.risk === 'high').length}</span>
          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">中風險: {alerts.filter(a => a.risk === 'medium').length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">目前無待處理告警</h3>
            <p className="text-slate-500 dark:text-slate-400">系統運作正常，無異常狀況。</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-full shrink-0 ${alert.risk === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{alert.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${alert.risk === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {alert.risk === 'high' ? '高風險' : '中風險'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{alert.desc}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{alert.user}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                  <button 
                    onClick={() => handleAction(alert.id, 'suspend')}
                    className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <ShieldOff className="w-4 h-4" />
                    <span>暫時停權</span>
                  </button>
                  <button 
                    onClick={() => handleAction(alert.id, 'ignore')}
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>標記誤報</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

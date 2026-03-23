import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const roleFrequencyData = [
  { time: '08:00', 會計: 120, 業務: 80, 採購: 40 },
  { time: '10:00', 會計: 350, 業務: 200, 採購: 150 },
  { time: '12:00', 會計: 100, 業務: 90, 採購: 60 },
  { time: '14:00', 會計: 400, 業務: 250, 採購: 180 },
  { time: '16:00', 會計: 380, 業務: 220, 採購: 160 },
  { time: '18:00', 會計: 80, 業務: 150, 採購: 30 },
  { time: '20:00', 會計: 10, 業務: 60, 採購: 5 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">職務行為分析 (UBA)</h2>
      </div>

      <div className="space-y-6">
        {/* Role Frequency Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">各職位操作頻度趨勢</h3>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>今日</option>
              <option>本週</option>
              <option>本月</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roleFrequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="會計" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="業務" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="採購" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Behavior Insights */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">行為偏移洞察</h3>
          <div className="flex-1 space-y-3">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-bold mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <h4 className="text-sm">會計部 - 報表匯出激增</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">本週會計部門「報表匯出」功能使用率較歷史基準線高出 <span className="font-bold text-red-500 dark:text-red-400">145%</span>，請留意是否有異常資料外流風險。</p>
            </div>
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold mb-1.5">
                <TrendingDown className="w-4 h-4" />
                <h4 className="text-sm">業務部 - 系統活躍度下降</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">特定業務人員 (B0012, B0015) 近三日系統登入與操作頻率大幅下降，偏離職位基準線。</p>
            </div>
          </div>
        </div>

        {/* Role Operation Frequency */}
        <div className="bg-white dark:bg-[#161618] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800/60">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">職能操作頻率</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">各部門活動權重對比</p>
          </div>
          
          <div className="space-y-5">
            {/* 會計 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">會計</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">82%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#2a2a2a] rounded-full h-3">
                <div className="bg-indigo-300 dark:bg-[#b4c4ff] h-3 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* 人資 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">人資</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">45%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#2a2a2a] rounded-full h-3">
                <div className="bg-emerald-400 dark:bg-[#86efac] h-3 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* 採購 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">採購</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">68%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#2a2a2a] rounded-full h-3">
                <div className="bg-rose-300 dark:bg-[#fca5a5] h-3 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

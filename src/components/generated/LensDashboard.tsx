import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Building2, ShieldCheck, ArrowUpRight, ArrowDownRight, AlertCircle, Clock, FileText, Plus, History, DollarSign, Briefcase, MapPin, Sparkles, BarChart3, Droplets, Percent, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { LandTracker } from './LandTracker';
import { AICitationAssistant } from './AICitationAssistant';
import { AssetInventory } from './AssetInventory';
import { AddAssetModal } from './AddAssetModal';
import { LiquidityEngine } from './LiquidityEngine';
import { PerformanceDashboard } from './PerformanceDashboard';

// --- Types ---

type AssetClass = 'Real Estate' | 'Financial Assets' | 'Operating Businesses' | 'Alternatives' | 'Cash';
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'Verified' | 'Stale';
  icon: React.ReactNode;
  secondary?: string;
}
interface ActivityItem {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  value: string;
  valueColor: string;
  timestamp: string;
}

// --- Mock Data ---

const PERFORMANCE_DATA = [{
  month: 'Jan',
  netWorth: 92000000
}, {
  month: 'Feb',
  netWorth: 94500000
}, {
  month: 'Mar',
  netWorth: 93800000
}, {
  month: 'Apr',
  netWorth: 96200000
}, {
  month: 'May',
  netWorth: 98100000
}, {
  month: 'Jun',
  netWorth: 102450000
}] as any[];
const ASSET_ALLOCATION = [{
  name: 'Real Estate',
  value: 45000000,
  color: '#8B5CF6',
  allocation: 43.9
}, {
  name: 'Financial Assets',
  value: 32000000,
  color: '#3B82F6',
  allocation: 31.2
}, {
  name: 'Operating Businesses',
  value: 15000000,
  color: '#EC4899',
  allocation: 14.6
}, {
  name: 'Cash',
  value: 8000000,
  color: '#10B981',
  allocation: 7.8
}, {
  name: 'Other',
  value: 2450000,
  color: '#F59E0B',
  allocation: 2.5
}] as any[];

// --- Sub-components ---

const StatusIndicator = ({
  status
}: {
  status: 'Verified' | 'Stale';
}) => {
  return <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${status === 'Verified' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
      {status}
    </div>;
};
const MetricCard = ({
  title,
  value,
  change,
  trend,
  status,
  icon,
  secondary
}: MetricCardProps) => <motion.div initial={{
  opacity: 0,
  y: 20
}} animate={{
  opacity: 1,
  y: 0
}} className="bg-[#F5F3EF] border border-[#1E5F46]/10 rounded-lg p-6 hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E5F46] to-[#166534] flex items-center justify-center text-[#F5F3EF]">
        {icon}
      </div>
      {status && <StatusIndicator status={status} />}
    </div>
    
    <div className="space-y-1">
      <p className="text-sm font-medium text-[#1E5F46]/70">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#1E5F46]">{value}</h3>
        {change && <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>}
      </div>
      {secondary && <p className="text-xs text-[#1E5F46]/60 mt-1">{secondary}</p>}
    </div>
  </motion.div>;

// @component: LensDashboard
export const LensDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'liquidity' | 'performance' | 'land' | 'ai-assistant'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(val);
  };
  const formatCurrencyFull = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  const totalNetWorth = 102450000;
  const recentActivities: ActivityItem[] = [{
    icon: <Building2 className="w-4 h-4" />,
    iconColor: 'from-[#8B5CF6] to-[#6D28D9]',
    title: 'Property Valuation',
    description: 'Al Barsha South updated',
    value: '+4.2M',
    valueColor: 'text-[#10B981]',
    timestamp: '2h ago'
  }, {
    icon: <TrendingUp className="w-4 h-4" />,
    iconColor: 'from-[#3B82F6] to-[#1D4ED8]',
    title: 'Dividend Received',
    description: 'Global Equities Portfolio',
    value: '+125K',
    valueColor: 'text-[#10B981]',
    timestamp: '5h ago'
  }, {
    icon: <FileText className="w-4 h-4" />,
    iconColor: 'from-[#F59E0B] to-[#D97706]',
    title: 'Document Updated',
    description: 'Tech Growth Fund III',
    value: '—',
    valueColor: 'text-[#1E5F46]/40',
    timestamp: '1d ago'
  }, {
    icon: <Wallet className="w-4 h-4" />,
    iconColor: 'from-[#EF4444] to-[#DC2626]',
    title: 'Cash Transfer',
    description: 'Operating Account',
    value: '-850K',
    valueColor: 'text-[#EF4444]',
    timestamp: '2d ago'
  }];

  // @return
  return <div className="min-h-screen bg-[#F5F3EF] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E5F46]/10 bg-[#F5F3EF] flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-6 border-b border-[#1E5F46]/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1E5F46] to-[#166534] rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-5 h-5 border-2 border-[#F5F3EF] rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E5F46]">LENS</span>
          </div>
          <p className="text-[9px] font-semibold text-[#1E5F46]/60 uppercase tracking-widest">
            Portfolio Manager
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[{
          id: 'overview',
          icon: LayoutDashboard,
          label: 'Portfolio Overview'
        }, {
          id: 'assets',
          icon: Briefcase,
          label: 'Asset Inventory'
        }, {
          id: 'liquidity',
          icon: Wallet,
          label: 'Liquidity Engine'
        }, {
          id: 'performance',
          icon: TrendingUp,
          label: 'Performance'
        }].map(item => <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-md' : 'text-[#1E5F46]/70 hover:bg-[#1E5F46]/5 hover:text-[#1E5F46]'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>)}
          
          <div className="h-px bg-[#1E5F46]/10 my-2" />
          
          {[{
          id: 'land',
          icon: MapPin,
          label: 'Land Tracker'
        }, {
          id: 'ai-assistant',
          icon: Sparkles,
          label: 'AI Assistant'
        }].map(item => <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-md' : 'text-[#1E5F46]/70 hover:bg-[#1E5F46]/5 hover:text-[#1E5F46]'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>)}
        </nav>

        <div className="p-4 border-t border-[#1E5F46]/10">
          <div className="bg-white/50 rounded-lg p-4 border border-[#1E5F46]/10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#1E5F46]" />
              <span className="text-xs font-semibold text-[#1E5F46]">Data Confidence</span>
            </div>
            <div className="w-full bg-[#1E5F46]/10 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E5F46] to-[#10B981] h-full w-[82%] shadow-sm" />
            </div>
            <p className="text-[10px] text-[#1E5F46]/70 mt-2">3 items need manual verification</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Conditional Rendering */}
        {activeTab === 'land' && <LandTracker />}
        {activeTab === 'ai-assistant' && <AICitationAssistant />}
        {activeTab === 'assets' && <AssetInventory />}
        {activeTab === 'liquidity' && <LiquidityEngine />}
        {activeTab === 'performance' && <PerformanceDashboard />}
        
        {/* Overview Tab */}
        {activeTab === 'overview' && <>
            <header className="h-16 border-b border-[#1E5F46]/10 bg-[#F5F3EF] sticky top-0 z-10 flex items-center justify-between px-8">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-semibold text-[#1E5F46]">Portfolio Dashboard</h1>
                <div className="h-4 w-px bg-[#1E5F46]/10 mx-2" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Live Sync</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-[#1E5F46]/20 rounded-lg text-xs font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
                  <History className="w-4 h-4" />
                  Audit Trail
                </button>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-lg text-xs font-medium hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Add Data Point
                </button>
              </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard title="Total Net Worth" value="102.45M" change="4.2%" trend="up" status="Verified" icon={<DollarSign className="w-5 h-5" />} secondary="AED 102,450,000" />
                <MetricCard title="Total Return on Net Worth" value="14.2%" change="2.1%" trend="up" status="Verified" icon={<TrendingUp className="w-5 h-5" />} secondary="YTD Performance" />
                <MetricCard title="Portfolio IRR" value="12.8%" change="0.3%" trend="up" status="Verified" icon={<Activity className="w-5 h-5" />} secondary="Internal Rate of Return" />
                <MetricCard title="Available Liquidity" value="2.45M" change="2.4%" trend="down" status="Verified" icon={<Droplets className="w-5 h-5" />} secondary="2.4% of total" />
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - 60% width (3 columns) */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Capital Allocation Donut Chart */}
                  <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} className="bg-white border border-[#1E5F46]/10 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-[#1E5F46] mb-1">Capital Allocation</h2>
                      <p className="text-sm text-[#1E5F46]/60">Distribution across asset classes</p>
                    </div>
                    
                    <div className="h-[280px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={ASSET_ALLOCATION} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                            {ASSET_ALLOCATION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid rgba(30, 95, 70, 0.1)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} formatter={(value: number) => [formatCurrencyFull(value), 'Value']} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-[#1E5F46]/60 uppercase tracking-widest">Total</span>
                        <span className="text-2xl font-bold text-[#1E5F46]">102.45M</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-[#1E5F46]/10 pt-6">
                      {ASSET_ALLOCATION.map(item => <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:bg-[#F5F3EF] p-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{
                        backgroundColor: item.color
                      }} />
                            <span className="text-sm font-medium text-[#1E5F46]/80 group-hover:text-[#1E5F46]">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#1E5F46]/60">{item.allocation}%</span>
                            <span className="text-sm font-bold text-[#1E5F46] min-w-[100px] text-right">
                              {formatCurrency(item.value)}
                            </span>
                          </div>
                        </div>)}
                    </div>
                  </motion.div>

                  {/* Monthly Performance Line Chart */}
                  <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.1
              }} className="bg-white border border-[#1E5F46]/10 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-[#1E5F46] mb-1">Net Worth Trajectory</h2>
                      <p className="text-sm text-[#1E5F46]/60">Monthly portfolio value progression</p>
                    </div>
                    
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={PERFORMANCE_DATA}>
                          <defs>
                            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1E5F46" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="#1E5F46" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(30, 95, 70, 0.1)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{
                        fill: '#1E5F46',
                        opacity: 0.6,
                        fontSize: 12
                      }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{
                        fill: '#1E5F46',
                        opacity: 0.6,
                        fontSize: 12
                      }} tickFormatter={value => `${value / 1000000}M`} />
                          <Tooltip contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid rgba(30, 95, 70, 0.1)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} formatter={(value: number) => [formatCurrencyFull(value), 'Net Worth']} />
                          <Area type="monotone" dataKey="netWorth" stroke="#1E5F46" strokeWidth={3} fillOpacity={1} fill="url(#netWorthGradient)" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - 40% width (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Monthly Growth Card */}
                  <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.2
              }} className="bg-gradient-to-br from-[#1E5F46] to-[#166534] rounded-xl p-6 text-[#F5F3EF] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold opacity-90">Monthly Growth</h3>
                      <BarChart3 className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold">+4.2M</div>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+4.3% from last month</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="text-xs opacity-75 mb-2">Target: 3.5M/month</div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full w-[120%] rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Activity Feed */}
                  <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.3
              }} className="bg-white border border-[#1E5F46]/10 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-[#1E5F46] mb-1">Recent Activity</h2>
                      <p className="text-sm text-[#1E5F46]/60">Latest portfolio updates</p>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivities.map((activity, idx) => <div key={idx} className="flex gap-3 group cursor-pointer hover:bg-[#F5F3EF] p-3 rounded-lg transition-all">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.iconColor} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1E5F46] truncate">{activity.title}</p>
                            <p className="text-xs text-[#1E5F46]/60 truncate">{activity.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-sm font-bold ${activity.valueColor}`}>{activity.value}</p>
                            <p className="text-xs text-[#1E5F46]/40">{activity.timestamp}</p>
                          </div>
                        </div>)}
                    </div>
                  </motion.div>

                  {/* Alerts & Notifications */}
                  <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.4
              }} className="bg-white border border-[#1E5F46]/10 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-[#1E5F46] mb-1">Alerts & Notifications</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1E5F46]">High Concentration</p>
                          <p className="text-xs text-[#1E5F46]/70 mt-1">Real Estate: 44% of portfolio</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
                        <Clock className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1E5F46]">Document Overdue</p>
                          <p className="text-xs text-[#1E5F46]/70 mt-1">Logistics Corp audit report</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1E5F46]">Systems Normal</p>
                          <p className="text-xs text-[#1E5F46]/70 mt-1">Cash flow is healthy</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </>}

        {/* Add Asset Modal */}
        <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={data => {
        console.log('New asset data from dashboard:', data);
        // Handle asset creation here
      }} />
      </main>
    </div>;
};
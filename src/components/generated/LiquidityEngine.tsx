"use client";

import React, { useState } from 'react';
import { Droplets, Zap, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Bell, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

// --- Types ---

interface CryptoAsset {
  symbol: string;
  name: string;
  icon: string;
  amount: string;
  aedValue: number;
  usdValue: number;
  change24h: number;
  sparklineData: number[];
}
interface StockHolding {
  ticker: string;
  company: string;
  exchange: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  todayChange: number;
  totalPL: number;
  totalPLPercent: number;
  sparklineData: number[];
}

// --- Mock Data ---

const CRYPTO_ASSETS: CryptoAsset[] = [{
  symbol: '₿ BTC',
  name: 'Bitcoin',
  icon: '₿',
  amount: '2.45 BTC',
  aedValue: 482500,
  usdValue: 131500,
  change24h: 5.2,
  sparklineData: [195000, 196500, 195800, 197200, 198500, 200100, 197800]
}, {
  symbol: 'Ξ ETH',
  name: 'Ethereum',
  icon: 'Ξ',
  amount: '45.8 ETH',
  aedValue: 385000,
  usdValue: 104850,
  change24h: 12.4,
  sparklineData: [8200, 8350, 8500, 8700, 8900, 9100, 8400]
}, {
  symbol: 'BNB',
  name: 'Binance Coin',
  icon: '◆',
  amount: '890 BNB',
  aedValue: 245000,
  usdValue: 66750,
  change24h: -2.1,
  sparklineData: [280, 285, 275, 272, 268, 270, 275]
}, {
  symbol: 'ADA',
  name: 'Cardano',
  icon: '₳',
  amount: '125,000 ADA',
  aedValue: 137500,
  usdValue: 37450,
  change24h: 8.9,
  sparklineData: [1.05, 1.08, 1.10, 1.12, 1.15, 1.18, 1.10]
}];
const STOCK_HOLDINGS: StockHolding[] = [{
  ticker: 'AAPL',
  company: 'Apple Inc.',
  exchange: 'NASDAQ',
  shares: 150,
  avgCost: 520.50,
  currentPrice: 630.00,
  currentValue: 94500,
  todayChange: -2.4,
  totalPL: 16425,
  totalPLPercent: 21.0,
  sparklineData: [640, 638, 635, 632, 630, 628, 630]
}, {
  ticker: 'EMAAR',
  company: 'Emaar Properties',
  exchange: 'DFM',
  shares: 5000,
  avgCost: 4.25,
  currentPrice: 5.10,
  currentValue: 25500,
  todayChange: 1.8,
  totalPL: 4250,
  totalPLPercent: 20.0,
  sparklineData: [5.00, 5.05, 5.08, 5.10, 5.12, 5.15, 5.10]
}, {
  ticker: 'ADNOC',
  company: 'ADNOC Distribution',
  exchange: 'ADX',
  shares: 10000,
  avgCost: 3.15,
  currentPrice: 3.45,
  currentValue: 34500,
  todayChange: -0.5,
  totalPL: 3000,
  totalPLPercent: 9.5,
  sparklineData: [3.48, 3.47, 3.46, 3.45, 3.44, 3.43, 3.45]
}, {
  ticker: 'TSLA',
  company: 'Tesla Inc.',
  exchange: 'NASDAQ',
  shares: 50,
  avgCost: 880.00,
  currentPrice: 920.00,
  currentValue: 46000,
  todayChange: 3.2,
  totalPL: 2000,
  totalPLPercent: 4.5,
  sparklineData: [890, 895, 905, 910, 915, 920, 920]
}, {
  ticker: 'DU',
  company: 'Emirates Integrated',
  exchange: 'DFM',
  shares: 20000,
  avgCost: 5.80,
  currentPrice: 6.10,
  currentValue: 122000,
  todayChange: 0.8,
  totalPL: 6000,
  totalPLPercent: 5.2,
  sparklineData: [6.05, 6.08, 6.10, 6.12, 6.10, 6.08, 6.10]
}, {
  ticker: 'MSFT',
  company: 'Microsoft Corp.',
  exchange: 'NASDAQ',
  shares: 200,
  avgCost: 1450.00,
  currentPrice: 1520.00,
  currentValue: 304000,
  todayChange: -1.2,
  totalPL: 14000,
  totalPLPercent: 4.8,
  sparklineData: [1540, 1535, 1530, 1525, 1520, 1518, 1520]
}, {
  ticker: 'ADCB',
  company: 'Abu Dhabi Commercial',
  exchange: 'ADX',
  shares: 8000,
  avgCost: 8.20,
  currentPrice: 8.90,
  currentValue: 71200,
  todayChange: 2.1,
  totalPL: 5600,
  totalPLPercent: 8.5,
  sparklineData: [8.70, 8.75, 8.80, 8.85, 8.88, 8.90, 8.90]
}, {
  ticker: 'ARAMCO',
  company: 'Saudi Aramco',
  exchange: 'Tadawul',
  shares: 1500,
  avgCost: 32.50,
  currentPrice: 34.20,
  currentValue: 51300,
  todayChange: -0.9,
  totalPL: 2550,
  totalPLPercent: 5.2,
  sparklineData: [34.50, 34.40, 34.30, 34.20, 34.10, 34.15, 34.20]
}];
const PORTFOLIO_24H_DATA = Array.from({
  length: 25
}, (_, i) => ({
  time: `${i}:00`,
  value: 1250000 + Math.random() * 100000 - 50000
}));
const STOCK_PORTFOLIO_DATA = Array.from({
  length: 30
}, (_, i) => ({
  day: i + 1,
  value: 750000 + i * 2000 + Math.random() * 20000 - 10000
}));
const LIQUIDITY_BREAKDOWN = [{
  name: 'Crypto',
  value: 1250000,
  color: '#F0B90B',
  percent: 44
}, {
  name: 'Stocks',
  value: 750000,
  color: '#00457C',
  percent: 26
}, {
  name: 'Cash',
  value: 570000,
  color: '#10B981',
  percent: 20
}, {
  name: 'Fixed Deposits',
  value: 277500,
  color: '#8B5CF6',
  percent: 10
}] as any[];

// --- Subcomponents ---

const SummaryCard = ({
  icon,
  label,
  value,
  change,
  bgColor
}: any) => <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
    <p className="text-sm text-[#6B7280] mb-1">{label}</p>
    <p className="text-3xl font-bold text-[#111827] mb-2">{value}</p>
    {change && <p className={`text-sm font-semibold ${change.startsWith('↑') ? 'text-[#10B981]' : change.startsWith('↓') ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
        {change}
      </p>}
  </div>;
const MiniSparkline = ({
  data,
  positive
}: {
  data: number[];
  positive: boolean;
}) => <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data.map((value, i) => ({
    value,
    index: i
  }))}>
      <Line type="monotone" dataKey="value" stroke={positive ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
const CryptoCard = ({
  asset
}: {
  asset: CryptoAsset;
}) => <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 hover:transform hover:-translate-y-1 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{asset.icon}</span>
        <span className="font-bold text-base">{asset.symbol}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded ${asset.change24h > 0 ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'}`}>
        {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
      </span>
    </div>
    
    <p className="text-sm font-medium text-[#6B7280] mb-1">{asset.amount}</p>
    <p className="text-lg font-bold text-[#111827] mb-1">AED {asset.aedValue.toLocaleString()}</p>
    <p className="text-xs text-[#6B7280] mb-3">${asset.usdValue.toLocaleString()}</p>
    
    <MiniSparkline data={asset.sparklineData} positive={asset.change24h > 0} />
  </div>;
const StockRow = ({
  stock
}: {
  stock: StockHolding;
}) => <div className="border-b border-[#E5E7EB] py-4 hover:bg-[#F9FAFB] transition-colors">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Column 1: Stock Info */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-base text-[#111827]">{stock.ticker}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#E5E7EB] text-[#6B7280]">{stock.exchange}</span>
        </div>
        <p className="text-xs text-[#6B7280]">{stock.company}</p>
      </div>
      
      {/* Column 2: Holdings */}
      <div>
        <p className="text-sm font-medium text-[#6B7280]">{stock.shares} shares</p>
        <p className="text-xs text-[#6B7280]">Avg: AED {stock.avgCost.toFixed(2)}</p>
        <p className="text-base font-bold text-[#111827] mt-1">AED {stock.currentValue.toLocaleString()}</p>
      </div>
      
      {/* Column 3: Performance */}
      <div className="flex flex-col items-end">
        <p className="text-base font-bold text-[#111827]">AED {stock.currentPrice.toFixed(2)}</p>
        <p className={`text-sm font-semibold ${stock.todayChange > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {stock.todayChange > 0 ? '↑' : '↓'} {Math.abs(stock.todayChange)}%
        </p>
        <p className={`text-sm font-bold mt-1 ${stock.totalPL > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {stock.totalPL > 0 ? '+' : ''}AED {stock.totalPL.toLocaleString()} ({stock.totalPL > 0 ? '+' : ''}{stock.totalPLPercent}%)
        </p>
        <div className="w-24 h-8 mt-2">
          <MiniSparkline data={stock.sparklineData} positive={stock.todayChange > 0} />
        </div>
      </div>
    </div>
  </div>;

// --- Main Component ---

export const LiquidityEngine = () => {
  const [cryptoTimeRange, setCryptoTimeRange] = useState('24H');
  const [stockTimeRange, setStockTimeRange] = useState('1M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  return <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header Section */}
      <header className="bg-white border-b border-[#E5E7EB] px-8 py-8">
        <h1 className="text-[1.875rem] font-bold text-[#1E5F46] mb-2">Liquidity Engine</h1>
        <p className="text-[0.95rem] text-[#6B7280]">Real-time view of liquid and semi-liquid assets</p>
      </header>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard icon="💧" label="Total Liquid Assets" value="AED 2,847,500" change="↑ 2.4%" bgColor="bg-[#10B981]/10" />
          <SummaryCard icon="⚡" label="Immediately Available" value="AED 847,500" change="Cash + Current Accounts" bgColor="bg-[#3B82F6]/10" />
          <SummaryCard icon="₿" label="Cryptocurrency" value="AED 1,250,000" change="↑ 8.7%" bgColor="bg-[#F59E0B]/10" />
          <SummaryCard icon="📈" label="Securities" value="AED 750,000" change="↓ 1.2%" bgColor="bg-[#8B5CF6]/10" />
        </div>

        {/* Liquidity Breakdown (Top Section) */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-[#111827] mb-6">Liquidity Breakdown</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Donut Chart */}
            <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={LIQUIDITY_BREAKDOWN} cx="50%" cy="50%" innerRadius={80} outerRadius={130} dataKey="value" paddingAngle={2}>
                    {LIQUIDITY_BREAKDOWN.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Total</span>
                <span className="text-3xl font-bold text-[#111827]">AED 2.8M</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-4">
              {LIQUIDITY_BREAKDOWN.map((item, idx) => <div key={idx} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: item.color
                }} />
                    <span className="text-base font-medium text-[#111827]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold text-[#6B7280]">{item.percent}%</span>
                    <span className="text-base font-bold text-[#111827] min-w-[120px] text-right">
                      AED {(item.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* External Platform Widgets - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Binance Widget */}
          <div className="bg-white border-2 border-[#F0B90B] rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#F0B90B] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">◆</div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Binance</h3>
                  <p className="text-xs text-[#111827]/70">#BSC-4829...</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827] mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  LIVE
                </div>
                <p className="text-[0.7rem] text-[#111827]/60">Updated 2 min ago</p>
              </div>
            </div>

            {/* Total Portfolio Value */}
            <div className="bg-gradient-to-r from-[#FEF3C7] to-white px-6 py-6 border-b border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-1">Total Portfolio Value</p>
              <p className="text-4xl font-bold text-[#111827] mb-2">AED 1,250,000</p>
              <p className="text-base text-[#6B7280] mb-2">≈ $340,382</p>
              <p className="text-base font-bold text-[#10B981]">↑ AED 108,500 (8.7%)</p>
            </div>

            {/* Holdings Grid */}
            <div className="bg-white px-6 py-6">
              <div className="grid grid-cols-1 gap-4">
                {CRYPTO_ASSETS.map((asset, idx) => <CryptoCard key={idx} asset={asset} />)}
              </div>
            </div>

            {/* 24-Hour Performance Chart */}
            <div className="bg-white px-6 py-6 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-[#111827]">24-Hour Performance</h4>
                <div className="flex gap-2">
                  {['1H', '24H', '7D', '30D'].map(range => <button key={range} onClick={() => setCryptoTimeRange(range)} className={`px-3 py-1 text-xs font-medium rounded ${cryptoTimeRange === range ? 'bg-[#F0B90B] text-[#111827]' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
                      {range}
                    </button>)}
                </div>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PORTFOLIO_24H_DATA}>
                    <defs>
                      <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F0B90B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="value" stroke="#F0B90B" strokeWidth={3} fill="url(#cryptoGradient)" dot={false} />
                    <Tooltip contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Value']} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Mashreq Trader Widget */}
          <div className="bg-white border-2 border-[#00457C] rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#00457C] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-white font-bold">M</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mashreq Trader</h3>
                  <p className="text-xs text-white/80">Trading A/C ...3847</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  MARKET OPEN
                </div>
                <p className="text-[0.7rem] text-white/70">Synced 5 min ago</p>
              </div>
            </div>

            {/* Total Portfolio Value */}
            <div className="bg-gradient-to-r from-[#DBEAFE] to-white px-6 py-6 border-b border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-1">Securities Portfolio</p>
              <p className="text-4xl font-bold text-[#111827] mb-2">AED 750,000</p>
              <p className="text-base font-bold text-[#EF4444] mb-2">↓ AED 9,200 (-1.2%)</p>
              <p className="text-sm text-[#6B7280]">Cash Available: AED 45,000</p>
            </div>

            {/* Holdings List */}
            <div className="bg-white px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-[#111827]">Holdings (8 positions)</h4>
                <button className="text-sm text-[#00457C] font-medium hover:underline">View All →</button>
              </div>
              
              <div className="space-y-0 max-h-[400px] overflow-y-auto">
                {STOCK_HOLDINGS.map((stock, idx) => <StockRow key={idx} stock={stock} />)}
              </div>
            </div>

            {/* Portfolio Performance Chart */}
            <div className="bg-white px-6 py-6 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-[#111827]">Portfolio Performance</h4>
                <div className="flex gap-2">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(range => <button key={range} onClick={() => setStockTimeRange(range)} className={`px-3 py-1 text-xs font-medium rounded ${stockTimeRange === range ? 'bg-[#00457C] text-white' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
                      {range}
                    </button>)}
                </div>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={STOCK_PORTFOLIO_DATA}>
                    <defs>
                      <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00457C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00457C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="value" stroke="#00457C" strokeWidth={3} fill="url(#stockGradient)" dot={false} />
                    <Tooltip contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Value']} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
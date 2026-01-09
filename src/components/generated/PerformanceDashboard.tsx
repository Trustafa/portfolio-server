"use client";

import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowUpRight, Building2, Briefcase, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { motion } from 'framer-motion';

// --- Types ---

interface TimeSeriesDataPoint {
  date: string;
  timestamp: number;
  liquid: number;
  semiLiquid: number;
  illiquid: number;
  total: number;
}
interface Property {
  name: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  area: string;
  owner: 'Zanulda' | 'Joint' | 'Taher';
  plot: string;
  documents: {
    titleDeed: boolean;
    saleFile: boolean;
    mukiya: boolean;
  };
}
type TimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

// --- Real Asset Data ---

const PROPERTIES: Property[] = [{
  name: 'Al Barsha South',
  purchaseDate: '2022-03-16',
  purchasePrice: 720000,
  currentValue: 800000,
  location: 'Dubai',
  area: '3,000 sq.ft',
  owner: 'Zanulda',
  plot: '1234-567',
  documents: {
    titleDeed: true,
    saleFile: true,
    mukiya: false
  }
}, {
  name: 'Al Sajaa Industrial',
  purchaseDate: '2023-07-20',
  purchasePrice: 428000,
  currentValue: 450000,
  location: 'Sharjah',
  area: '5,000 sq.ft',
  owner: 'Zanulda',
  plot: 'SAJ-8901',
  documents: {
    titleDeed: false,
    saleFile: true,
    mukiya: false
  }
}, {
  name: 'Al Hamra Village',
  purchaseDate: '2024-01-16',
  purchasePrice: 600000,
  currentValue: 625000,
  location: 'Ras Al Khaimah',
  area: '10,000 sq.ft',
  owner: 'Joint',
  plot: 'RAK-4847',
  documents: {
    titleDeed: true,
    saleFile: false,
    mukiya: true
  }
}];

// --- Generate Historical Timeline Data ---

const generateTimelineData = (demoMode: boolean): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const startDate = new Date('2022-03-01');
  const endDate = new Date('2026-01-05');
  let currentDate = new Date(startDate);

  // Track property values over time
  const getPropertyValue = (property: Property, date: Date): number => {
    const purchaseDate = new Date(property.purchaseDate);
    if (date < purchaseDate) return 0;
    const monthsSincePurchase = (date.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const totalMonths = (new Date().getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const appreciationRate = (property.currentValue - property.purchasePrice) / property.purchasePrice;
    if (monthsSincePurchase >= totalMonths) {
      return property.currentValue;
    }
    const currentAppreciation = appreciationRate * monthsSincePurchase / totalMonths;
    return property.purchasePrice * (1 + currentAppreciation);
  };
  while (currentDate <= endDate) {
    const illiquid = PROPERTIES.reduce((sum, property) => sum + getPropertyValue(property, currentDate), 0);

    // Demo data for semi-liquid and liquid
    const semiLiquid = demoMode ? 750000 : 0;
    const liquid = demoMode ? 850000 : 0;
    data.push({
      date: currentDate.toISOString().split('T')[0],
      timestamp: currentDate.getTime(),
      liquid,
      semiLiquid,
      illiquid,
      total: illiquid + semiLiquid + liquid
    });

    // Move to next bi-weekly period
    currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  }
  return data;
};

// --- Custom Tooltip ---

const CustomTooltip = ({
  active,
  payload
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const date = new Date(data.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  const getPercentage = (value: number, total: number) => {
    return total > 0 ? (value / total * 100).toFixed(1) : '0.0';
  };
  return <div className="bg-white border border-[#1E5F46]/20 rounded-lg p-4 shadow-xl min-w-[280px]">
      <p className="text-sm font-bold text-center text-[#1E5F46] mb-3 pb-2 border-b border-[#1E5F46]/10">
        {date}
      </p>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-[#1E5F46]/60 mb-1">💰 Total Net Worth</p>
          <p className="text-lg font-bold text-[#1E5F46]">{formatCurrency(data.total)}</p>
        </div>

        <div className="h-px bg-[#1E5F46]/10" />

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-[#8B5CF6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              🏢 Illiquid Assets
            </p>
            <span className="text-xs text-[#1E5F46]/60">({getPercentage(data.illiquid, data.total)}%)</span>
          </div>
          <p className="text-sm font-bold text-[#8B5CF6] mb-2">{formatCurrency(data.illiquid)}</p>
          
          {PROPERTIES.map(property => {
          const propValue = data.illiquid > 0 ? property.currentValue / PROPERTIES.reduce((sum, p) => sum + p.currentValue, 0) * data.illiquid : 0;
          if (propValue > 0) {
            return <p key={property.name} className="text-xs text-[#1E5F46]/60 ml-3">
                  {property.name}: {formatCurrency(propValue)}
                </p>;
          }
          return null;
        })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-[#3B82F6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              📊 Semi-Liquid Assets
            </p>
            <span className="text-xs text-[#1E5F46]/60">({getPercentage(data.semiLiquid, data.total)}%)</span>
          </div>
          <p className="text-sm font-bold text-[#3B82F6]">{formatCurrency(data.semiLiquid)}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              💵 Liquid Assets
            </p>
            <span className="text-xs text-[#1E5F46]/60">({getPercentage(data.liquid, data.total)}%)</span>
          </div>
          <p className="text-sm font-bold text-[#10B981]">{formatCurrency(data.liquid)}</p>
        </div>
      </div>
    </div>;
};

// --- Main Component ---

export const PerformanceDashboard = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1Y');
  const [demoMode, setDemoMode] = useState(false);
  const timelineData = useMemo(() => generateTimelineData(demoMode), [demoMode]);
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    switch (selectedRange) {
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '3Y':
        startDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
        break;
      case '5Y':
        startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'ALL':
        return timelineData;
      default:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    return timelineData.filter(d => new Date(d.date) >= startDate);
  }, [timelineData, selectedRange]);
  const currentTotal = filteredData.length > 0 ? filteredData[filteredData.length - 1].total : 0;
  const previousTotal = filteredData.length > 1 ? filteredData[0].total : currentTotal;
  const totalChange = currentTotal - previousTotal;
  const percentageChange = previousTotal > 0 ? (totalChange / previousTotal * 100).toFixed(1) : '0.0';
  const totalIlliquid = PROPERTIES.reduce((sum, p) => sum + p.currentValue, 0);
  const totalSemiLiquid = demoMode ? 750000 : 0;
  const totalLiquid = demoMode ? 850000 : 0;
  const totalPurchasePrice = PROPERTIES.reduce((sum, p) => sum + p.purchasePrice, 0);
  const totalReturn = currentTotal - totalPurchasePrice - (demoMode ? 1600000 : 0);
  const bestPerformer = PROPERTIES.reduce((best, property) => {
    const appreciation = (property.currentValue - property.purchasePrice) / property.purchasePrice * 100;
    const bestAppreciation = (best.currentValue - best.purchasePrice) / best.purchasePrice * 100;
    return appreciation > bestAppreciation ? property : best;
  });
  const bestPerformerAppreciation = (bestPerformer.currentValue - bestPerformer.purchasePrice) / bestPerformer.purchasePrice * 100;
  const staleDocuments = PROPERTIES.filter(p => !p.documents.titleDeed || !p.documents.saleFile || !p.documents.mukiya).length;
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  const formatCurrencyShort = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 1,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(val);
  };
  const timeRanges: TimeRange[] = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'ALL'];
  return <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#1E5F46]/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1E5F46]">Performance</h1>
              <p className="text-sm text-[#1E5F46]/60 mt-2">Portfolio growth and asset allocation over time</p>
            </div>
            <button onClick={() => setDemoMode(!demoMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${demoMode ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-md' : 'border border-[#1E5F46]/20 text-[#1E5F46] hover:bg-[#1E5F46]/5'}`}>
              {demoMode ? '📋 Real Data Only' : '📊 Show Demo Data'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Main Performance Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white border border-[#1E5F46]/10 rounded-2xl p-8 shadow-sm">
          {/* Chart Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E5F46] mb-2">Total Net Worth Over Time</h2>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-[#1E5F46]">{formatCurrency(currentTotal)}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-[#10B981]">
                  <ArrowUpRight className="w-4 h-4" />
                  +{percentageChange}% (+{formatCurrencyShort(totalChange)})
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              {timeRanges.map(range => <button key={range} onClick={() => setSelectedRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRange === range ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-md' : 'bg-white border border-[#1E5F46]/20 text-[#1E5F46]/70 hover:text-[#1E5F46] hover:border-[#1E5F46]/40'}`}>
                  {range}
                </button>)}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }}>
                <defs>
                  <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="semiLiquidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="illiquidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 95, 70, 0.1)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{
                fill: '#1E5F46',
                opacity: 0.6,
                fontSize: 12
              }} tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-GB', {
                  month: 'short',
                  year: '2-digit'
                });
              }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{
                fill: '#1E5F46',
                opacity: 0.6,
                fontSize: 12
              }} tickFormatter={value => `${(value / 1000000).toFixed(1)}M`} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="liquid" stackId="1" stroke="#10B981" strokeWidth={2} fill="url(#liquidGradient)" />
                <Area type="monotone" dataKey="semiLiquid" stackId="1" stroke="#3B82F6" strokeWidth={2} fill="url(#semiLiquidGradient)" />
                <Area type="monotone" dataKey="illiquid" stackId="1" stroke="#8B5CF6" strokeWidth={2} fill="url(#illiquidGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-[#1E5F46]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-transparent border border-[#8B5CF6]" />
              <div>
                <p className="text-sm font-medium text-[#1E5F46]">Illiquid Assets</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-[#8B5CF6]">{formatCurrencyShort(totalIlliquid)}</p>
                  <span className="text-xs text-[#1E5F46]/60">
                    ({(totalIlliquid / currentTotal * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-3 rounded-full bg-gradient-to-r from-[#3B82F6] to-transparent border border-[#3B82F6]" />
              <div>
                <p className="text-sm font-medium text-[#1E5F46]">Semi-Liquid Assets</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-[#3B82F6]">{formatCurrencyShort(totalSemiLiquid)}</p>
                  <span className="text-xs text-[#1E5F46]/60">
                    ({currentTotal > 0 ? (totalSemiLiquid / currentTotal * 100).toFixed(0) : '0'}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-3 rounded-full bg-gradient-to-r from-[#10B981] to-transparent border border-[#10B981]" />
              <div>
                <p className="text-sm font-medium text-[#1E5F46]">Liquid Assets</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-[#10B981]">{formatCurrencyShort(totalLiquid)}</p>
                  <span className="text-xs text-[#1E5F46]/60">
                    ({currentTotal > 0 ? (totalLiquid / currentTotal * 100).toFixed(0) : '0'}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Asset Tier Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Illiquid Assets Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="bg-white border-2 border-[#8B5CF6] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-[#8B5CF6]" />
              <h3 className="text-lg font-bold text-[#8B5CF6]">Illiquid Assets</h3>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-[#1E5F46]">{formatCurrency(totalIlliquid)}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-semibold rounded-full">
                +{((totalIlliquid - totalPurchasePrice) / totalPurchasePrice * 100).toFixed(1)}% (1Y)
              </span>
            </div>

            <div className="space-y-3">
              {PROPERTIES.map(property => {
              const percentage = property.currentValue / totalIlliquid * 100;
              const appreciation = (property.currentValue - property.purchasePrice) / property.purchasePrice * 100;
              const documentsComplete = Object.values(property.documents).filter(Boolean).length;
              const totalDocuments = Object.keys(property.documents).length;
              return <div key={property.name} className="pb-3 border-b border-[#1E5F46]/10 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1E5F46]">{property.name}</p>
                        <p className="text-xs text-[#1E5F46]/60 mt-0.5">
                          {property.plot} | {property.location} | {property.area}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#1E5F46]">{formatCurrencyShort(property.currentValue)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${property.owner === 'Zanulda' ? 'bg-[#EC4899]/10 text-[#EC4899]' : property.owner === 'Joint' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'}`}>
                        {property.owner}
                      </span>
                      <span className="text-xs text-[#10B981] font-semibold">
                        +{appreciation.toFixed(1)}%
                      </span>
                      {documentsComplete < totalDocuments && <span className="text-xs text-[#F59E0B] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {totalDocuments - documentsComplete} missing
                        </span>}
                    </div>

                    <div className="w-full bg-[#8B5CF6]/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#8B5CF6] h-full rounded-full" style={{
                    width: `${percentage}%`
                  }} />
                    </div>
                  </div>;
            })}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/5 rounded-lg transition-colors">
              View all {PROPERTIES.length} properties →
            </button>
          </motion.div>

          {/* Semi-Liquid Assets Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="bg-white border-2 border-[#3B82F6] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-[#3B82F6]" />
              <h3 className="text-lg font-bold text-[#3B82F6]">Semi-Liquid Assets</h3>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-[#1E5F46]">{formatCurrency(totalSemiLiquid)}</p>
              {!demoMode && <span className="inline-block mt-2 px-2 py-1 bg-[#1E5F46]/10 text-[#1E5F46]/60 text-xs font-semibold rounded-full">—</span>}
            </div>

            {demoMode ? <div className="space-y-3">
                <div className="pb-3 border-b border-[#1E5F46]/10">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1E5F46]">Mashreq Trader Portfolio</p>
                    <p className="text-sm font-bold text-[#1E5F46]">AED 750K</p>
                  </div>
                  <div className="w-full bg-[#3B82F6]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3B82F6] h-full rounded-full" style={{
                  width: '100%'
                }} />
                  </div>
                </div>
              </div> : <div className="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase className="w-12 h-12 text-[#3B82F6]/30 mb-3" />
                <p className="text-sm font-medium text-[#1E5F46]/70 mb-1">No semi-liquid assets yet</p>
                <p className="text-xs text-[#1E5F46]/50 mb-4">Add investment accounts or fixed deposits to track securities</p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  + Add Investment Account
                </button>
              </div>}
          </motion.div>

          {/* Liquid Assets Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="bg-white border-2 border-[#10B981] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-6 h-6 text-[#10B981]" />
              <h3 className="text-lg font-bold text-[#10B981]">Liquid Assets / Cash</h3>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-[#1E5F46]">{formatCurrency(totalLiquid)}</p>
              {!demoMode && <span className="inline-block mt-2 px-2 py-1 bg-[#1E5F46]/10 text-[#1E5F46]/60 text-xs font-semibold rounded-full">—</span>}
            </div>

            {demoMode ? <div className="space-y-3">
                <div className="pb-3 border-b border-[#1E5F46]/10">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1E5F46]">Bank Accounts</p>
                    <p className="text-sm font-bold text-[#1E5F46]">AED 500K</p>
                  </div>
                  <div className="w-full bg-[#10B981]/10 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#10B981] h-full rounded-full" style={{
                  width: '58.8%'
                }} />
                  </div>
                </div>
                <div className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1E5F46]">Binance Crypto</p>
                    <p className="text-sm font-bold text-[#1E5F46]">AED 350K</p>
                  </div>
                  <div className="w-full bg-[#10B981]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full" style={{
                  width: '41.2%'
                }} />
                  </div>
                </div>
              </div> : <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="w-12 h-12 text-[#10B981]/30 mb-3" />
                <p className="text-sm font-medium text-[#1E5F46]/70 mb-1">No liquid assets tracked</p>
                <p className="text-xs text-[#1E5F46]/50 mb-4">Add bank accounts or crypto wallets to monitor liquidity</p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  + Add Bank Account
                </button>
              </div>}
          </motion.div>
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="bg-[#F5F3EF] rounded-lg p-5 text-center">
            <p className="text-xs font-bold text-[#1E5F46]/60 uppercase tracking-wider mb-2">TOTAL RETURN</p>
            <p className="text-3xl font-bold text-[#1E5F46] mb-1">{formatCurrencyShort(totalReturn)}</p>
            <p className="text-sm text-[#10B981] font-semibold flex items-center justify-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +{(totalReturn / (totalPurchasePrice + (demoMode ? 1600000 : 0)) * 100).toFixed(1)}%
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="bg-[#F5F3EF] rounded-lg p-5 text-center">
            <p className="text-xs font-bold text-[#1E5F46]/60 uppercase tracking-wider mb-2">BEST PERFORMER</p>
            <p className="text-xl font-bold text-[#1E5F46] mb-1">{bestPerformer.name}</p>
            <p className="text-sm text-[#10B981] font-semibold flex items-center justify-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +{bestPerformerAppreciation.toFixed(1)}%
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="bg-[#F5F3EF] rounded-lg p-5 text-center">
            <p className="text-xs font-bold text-[#1E5F46]/60 uppercase tracking-wider mb-2">CONCENTRATION</p>
            <p className="text-2xl font-bold text-[#1E5F46] mb-1">Real Estate</p>
            <p className="text-sm text-[#8B5CF6] font-semibold">
              {(totalIlliquid / currentTotal * 100).toFixed(0)}%
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.7
        }} className="bg-[#F5F3EF] rounded-lg p-5 text-center">
            <p className="text-xs font-bold text-[#1E5F46]/60 uppercase tracking-wider mb-2">DATA FRESHNESS</p>
            <p className={`text-2xl font-bold mb-1 ${staleDocuments > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
              {staleDocuments > 0 ? `${staleDocuments} Incomplete` : 'All Current'}
            </p>
            <p className="text-xs text-[#1E5F46]/60 flex items-center justify-center gap-1">
              {staleDocuments > 0 ? <>
                  <AlertCircle className="w-3 h-3" />
                  Missing documents
                </> : <>
                  <CheckCircle className="w-3 h-3" />
                  Fully documented
                </>}
            </p>
          </motion.div>
        </div>
      </div>
    </div>;
};
import React, { useState } from 'react';
import { MapPin, FileText, Plus, Search, Grid3x3, Table2, Filter, CheckCircle2, AlertCircle, Calendar, TrendingUp, Building, MapIcon, ArrowUpRight, X, Upload, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface LandPlot {
  id: string;
  name: string;
  plotNumber: string;
  location: string;
  owner: string;
  value: number;
  previousValue?: number;
  previousValueDate?: string;
  area: number;
  purchaseDate: string;
  appreciation: number;
  hasTitle: boolean;
  hasSaleFile: boolean;
  hasMukiya: boolean;
  completionStatus: 'complete' | 'incomplete';
  rentalIncome?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  valuationSource?: string;
}

// --- Mock Data ---

const LAND_PLOTS: LandPlot[] = [{
  id: '1',
  name: 'Al Barsha South',
  plotNumber: '1234-567',
  location: 'Dubai',
  owner: 'Zanulda',
  value: 800000,
  previousValue: 750000,
  previousValueDate: '2025-12-15',
  area: 3000,
  purchaseDate: '2022-03-16',
  appreciation: 6.7,
  hasTitle: true,
  hasSaleFile: true,
  hasMukiya: false,
  completionStatus: 'incomplete',
  valuationSource: 'Manual Entry - Market Comparison'
}, {
  id: '2',
  name: 'Al Sajaa Industrial',
  plotNumber: 'SAJ-8901',
  location: 'Sharjah',
  owner: 'Zanulda',
  value: 450000,
  area: 5000,
  purchaseDate: '2023-07-20',
  appreciation: 0,
  hasTitle: false,
  hasSaleFile: true,
  hasMukiya: false,
  completionStatus: 'incomplete'
}, {
  id: '3',
  name: 'Al Hamra Village, Ras Al Khaimah',
  plotNumber: 'RAK-4847',
  location: 'Ras Al Khaimah',
  owner: 'Joint',
  value: 625000,
  area: 10000,
  purchaseDate: '2024-01-16',
  appreciation: 4.2,
  hasTitle: true,
  hasSaleFile: false,
  hasMukiya: true,
  completionStatus: 'incomplete'
}];
const OWNERS = ['Zanulda', 'Joint', 'Aamir', 'Taher'];

// --- Sub-components ---

const DocumentBadge = ({
  type,
  hasDoc
}: {
  type: string;
  hasDoc: boolean;
}) => <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${hasDoc ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#1E5F46]/5 text-[#1E5F46]/40'}`}>
    {hasDoc ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3" />}
    {type}
  </div>;
const UpdatePropertyModal = ({
  plot,
  isOpen,
  onClose
}: {
  plot: LandPlot;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    newValuation: plot.value.toString(),
    valuationDate: new Date().toISOString().split('T')[0],
    monthlyRental: plot.rentalIncome?.toString() || '',
    rentalStartDate: plot.rentalStartDate || '',
    rentalEndDate: plot.rentalEndDate || '',
    valuationSource: plot.valuationSource || 'Manual Entry - Market Comparison',
    owner: plot.owner,
    titleDeedFile: null as File | null,
    mukiyaFile: null as File | null
  });
  const [titleDeedStatus, setTitleDeedStatus] = useState(plot.hasTitle ? 'Uploaded' : 'Not Uploaded');
  const [mukiyaStatus, setMukiyaStatus] = useState(plot.hasMukiya ? 'Uploaded' : 'Not Uploaded');
  const calculateChange = () => {
    if (!plot.previousValue) return 0;
    const change = (parseFloat(formData.newValuation) - plot.previousValue) / plot.previousValue * 100;
    return change.toFixed(1);
  };
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  if (!isOpen) return null;
  return <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#1E5F46]/10 px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1E5F46]">Update Property Data</h2>
              <p className="text-sm text-[#1E5F46]/60 mt-1">
                Enter the latest valuation and rental income information for this asset.
              </p>
              <p className="text-sm text-[#1E5F46]/60">
                All fields marked with <span className="text-red-500">*</span> are required. Data will be timestamped automatically.
              </p>
            </div>
            <button onClick={onClose} className="text-[#1E5F46]/60 hover:text-[#1E5F46] transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Info Banner */}
            <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1E5F46] mb-1">ℹ️ Data Update Requirement</h3>
                  <p className="text-xs text-[#1E5F46]/70">
                    Each asset requires at least 2 data points per month for accurate tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Previous Valuation Display */}
            {plot.previousValue && <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1E5F46] mb-1">Previous Valuation: {formatCurrency(plot.previousValue)}</p>
                    <p className="text-xs text-[#1E5F46]/60">
                      Date: {plot.previousValueDate ? new Date(plot.previousValueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#10B981]">Change: +{calculateChange()}%</p>
                  </div>
                </div>
              </div>}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6">
              {/* New Valuation */}
              <div>
                <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                  New Valuation <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formData.newValuation} onChange={e => setFormData({
                ...formData,
                newValuation: e.target.value
              })} placeholder="AED 800,000" className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
                <p className="text-xs text-[#1E5F46]/50 mt-1">Current market value of the property</p>
              </div>

              {/* Valuation Date */}
              <div>
                <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                  Valuation Date <span className="text-red-500">*</span>
                </label>
                <input type="date" value={formData.valuationDate} onChange={e => setFormData({
                ...formData,
                valuationDate: e.target.value
              })} className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
                <p className="text-xs text-[#1E5F46]/50 mt-1">Date of this valuation assessment</p>
              </div>

              {/* Owner Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                  Owner <span className="text-red-500">*</span>
                </label>
                <select value={formData.owner} onChange={e => setFormData({
                ...formData,
                owner: e.target.value
              })} className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent bg-white">
                  {OWNERS.map(owner => <option key={owner} value={owner}>{owner}</option>)}
                </select>
                <p className="text-xs text-[#1E5F46]/50 mt-1">Select property owner</p>
              </div>
            </div>

            {/* Monthly Rental Income */}
            <div>
              <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                Monthly Rental Income
              </label>
              <input type="text" value={formData.monthlyRental} onChange={e => setFormData({
              ...formData,
              monthlyRental: e.target.value
            })} placeholder="AED 0" className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
              <p className="text-xs text-[#1E5F46]/50 mt-1">Leave blank if property is not rented</p>
            </div>

            {/* Rental Period */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                  Rental Period Start Date
                </label>
                <input type="date" value={formData.rentalStartDate} onChange={e => setFormData({
                ...formData,
                rentalStartDate: e.target.value
              })} placeholder="Select start date" className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
                <p className="text-xs text-[#1E5F46]/50 mt-1">Start date of rental period</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                  Rental Period End Date
                </label>
                <input type="date" value={formData.rentalEndDate} onChange={e => setFormData({
                ...formData,
                rentalEndDate: e.target.value
              })} placeholder="Select end date" className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
                <p className="text-xs text-[#1E5F46]/50 mt-1">End date of rental period</p>
              </div>
            </div>

            {/* Valuation Source */}
            <div>
              <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                Valuation Source / Notes
              </label>
              <input type="text" value={formData.valuationSource} onChange={e => setFormData({
              ...formData,
              valuationSource: e.target.value
            })} placeholder="Manual Entry - Market Comparison" className="w-full px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" />
              <p className="text-xs text-[#1E5F46]/50 mt-1">Document the source of this valuation for audit trail</p>
            </div>

            {/* Document Management */}
            <div className="bg-[#F5F3EF] border border-[#1E5F46]/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#1E5F46]" />
                <h3 className="text-base font-bold text-[#1E5F46]">📄 Document Management</h3>
              </div>
              <p className="text-xs text-[#1E5F46]/60 mb-4">
                Upload or update property documents. PDF format recommended, max 10MB per file.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {/* Title Deed */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                    Title Deed (ملكية)
                  </label>
                  <div className="relative">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        titleDeedFile: file
                      });
                      setTitleDeedStatus('Uploaded');
                    }
                  }} className="hidden" id="titleDeedUpload" />
                    <label htmlFor="titleDeedUpload" className="flex items-center gap-2 px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm text-[#1E5F46]/70 hover:bg-[#1E5F46]/5 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choose Title Deed File
                    </label>
                  </div>
                  <p className={`text-xs mt-2 font-medium ${titleDeedStatus === 'Uploaded' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                    Current status: {titleDeedStatus === 'Uploaded' ? '✓ Uploaded' : '⚠ Not Uploaded'}
                  </p>
                </div>

                {/* Mulkiya */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E5F46] mb-2">
                    Mulkiya (استمارة)
                  </label>
                  <div className="relative">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        mukiyaFile: file
                      });
                      setMukiyaStatus('Uploaded');
                    }
                  }} className="hidden" id="mukiyaUpload" />
                    <label htmlFor="mukiyaUpload" className="flex items-center gap-2 px-4 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm text-[#1E5F46]/70 hover:bg-[#1E5F46]/5 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choose Mulkiya File
                    </label>
                  </div>
                  <p className={`text-xs mt-2 font-medium ${mukiyaStatus === 'Uploaded' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                    Current status: {mukiyaStatus === 'Uploaded' ? '✓ Uploaded' : '⚠ Not Uploaded'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E5F46]/10">
              <button onClick={onClose} className="px-6 py-2.5 border border-[#1E5F46]/20 rounded-md text-sm font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
                Cancel
              </button>
              <button onClick={() => {
              // Handle save logic here
              onClose();
            }} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-md text-sm font-medium hover:shadow-lg transition-all">
                <CheckCircle2 className="w-4 h-4" />
                Save Update
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>;
};
const PlotCard = ({
  plot,
  onUpdate
}: {
  plot: LandPlot;
  onUpdate: () => void;
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  const ownerColors = {
    Zanulda: {
      bar: 'bg-[#EC4899]',
      badge: 'bg-[#EC4899]/10 text-[#EC4899]'
    },
    Joint: {
      bar: 'bg-[#8B5CF6]',
      badge: 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
    },
    Aamir: {
      bar: 'bg-[#3B82F6]',
      badge: 'bg-[#3B82F6]/10 text-[#3B82F6]'
    },
    Taher: {
      bar: 'bg-[#F59E0B]',
      badge: 'bg-[#F59E0B]/10 text-[#F59E0B]'
    }
  };
  const ownerStyle = ownerColors[plot.owner as keyof typeof ownerColors] || ownerColors.Aamir;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-white border border-[#1E5F46]/10 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
      {/* Colored top bar indicating owner */}
      <div className={`h-1 ${ownerStyle.bar}`} />
      
      <div className="p-6">
        {/* Title & Owner */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1E5F46] mb-1">{plot.name}</h3>
            <p className="text-xs text-[#1E5F46]/50">Plot: {plot.plotNumber}</p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${ownerStyle.badge}`}>
            {plot.owner}
          </span>
        </div>

        {/* Current Valuation (very large) */}
        <div className="flex items-baseline gap-2 mb-4">
          <h2 className="text-2xl font-bold text-[#1E5F46]">{formatCurrency(plot.value)}</h2>
          {plot.appreciation > 0 && <span className="flex items-center gap-1 text-[#10B981] text-sm font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{plot.appreciation}%
            </span>}
        </div>

        {/* Key Details Grid (2 columns) */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#1E5F46]/5">
          <div>
            <p className="text-xs text-[#1E5F46]/50 mb-0.5">Area</p>
            <p className="text-sm font-semibold text-[#1E5F46]">{plot.area.toLocaleString()} sq.ft</p>
          </div>
          <div>
            <p className="text-xs text-[#1E5F46]/50 mb-0.5">Location</p>
            <p className="text-sm font-semibold text-[#1E5F46] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1E5F46]/40" />
              {plot.location}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-[#1E5F46]/50 mb-0.5">Purchase Date</p>
            <p className="text-sm font-semibold text-[#1E5F46] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#1E5F46]/40" />
              {new Date(plot.purchaseDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
            </p>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#1E5F46] uppercase tracking-wide">Documentation</p>
            {plot.completionStatus === 'complete' ? <span className="flex items-center gap-1 text-[#10B981] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete
              </span> : <span className="flex items-center gap-1 text-[#F59E0B] text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing docs
              </span>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <DocumentBadge type="Mukiya" hasDoc={plot.hasMukiya} />
            <DocumentBadge type="Title Deed" hasDoc={plot.hasTitle} />
            <DocumentBadge type="Sale File" hasDoc={plot.hasSaleFile} />
          </div>
        </div>

        {/* View Details Button */}
        <button onClick={onUpdate} className="w-full mt-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-md text-sm font-medium hover:shadow-lg transition-all">
          Update Property Data
        </button>
      </div>
    </motion.div>;
};

// --- Main Component ---

export const LandTracker = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalValue = LAND_PLOTS.reduce((sum, plot) => sum + plot.value, 0);
  const totalArea = LAND_PLOTS.reduce((sum, plot) => sum + plot.area, 0);
  const completeDocCount = LAND_PLOTS.filter(p => p.completionStatus === 'complete').length;
  const incompleteDocCount = LAND_PLOTS.filter(p => p.completionStatus === 'incomplete').length;
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  };
  const handleUpdateClick = (plot: LandPlot) => {
    setSelectedPlot(plot);
    setIsModalOpen(true);
  };
  return <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#1E5F46]/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E5F46]">Land Tracker</h1>
              <p className="text-sm text-[#1E5F46]/60 mt-1">Comprehensive land holdings management</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
                <FileText className="w-4 h-4" />
                Document Manager
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-md text-sm font-medium hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                Add Land Plot
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Document Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="border border-[#10B981]/20 bg-[#10B981]/5 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-[#1E5F46]">Complete Documentation</h3>
            </div>
            <p className="text-xs text-[#1E5F46]/60 mb-3">All documents uploaded</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1E5F46]">{completeDocCount}</span>
              <span className="text-sm text-[#10B981]">properties</span>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="border border-[#F59E0B]/20 bg-[#F59E0B]/5 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-sm font-semibold text-[#1E5F46]">Incomplete Documentation</h3>
            </div>
            <p className="text-xs text-[#1E5F46]/60 mb-3">Missing documents</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1E5F46]">{incompleteDocCount}</span>
              <span className="text-sm text-[#F59E0B]">properties</span>
            </div>
          </motion.div>
        </div>

        {/* Completion Progress */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-white border border-[#1E5F46]/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#1E5F46]">Documentation Completion Progress</h3>
            <span className="text-2xl font-bold text-[#1E5F46]">
              {Math.round(completeDocCount / LAND_PLOTS.length * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#1E5F46]/10 h-3 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#10B981] to-[#1E5F46] h-full rounded-full shadow-sm transition-all" style={{
            width: `${completeDocCount / LAND_PLOTS.length * 100}%`
          }} />
          </div>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1E5F46]/40" />
              <input type="text" placeholder="Search location, plot number, owner..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent w-80 bg-white" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-md p-1 border border-[#1E5F46]/10">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-sm' : 'text-[#1E5F46]/60 hover:text-[#1E5F46]'}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] shadow-sm' : 'text-[#1E5F46]/60 hover:text-[#1E5F46]'}`}>
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Land Plots Grid */}
        <div>
          <p className="text-sm text-[#1E5F46]/60 mb-4">
            Showing {LAND_PLOTS.length} of {LAND_PLOTS.length} land plots
          </p>

          {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LAND_PLOTS.map(plot => <PlotCard key={plot.id} plot={plot} onUpdate={() => handleUpdateClick(plot)} />)}
            </div> : <div className="bg-white border border-[#1E5F46]/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F3EF] border-b border-[#1E5F46]/10">
                  <tr className="text-xs font-semibold text-[#1E5F46]/70 uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Plot Name</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Owner</th>
                    <th className="px-6 py-3 text-right">Value</th>
                    <th className="px-6 py-3 text-right">Area</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E5F46]/5">
                  {LAND_PLOTS.map(plot => {
                const ownerColors = {
                  Zanulda: 'bg-[#EC4899]/10 text-[#EC4899]',
                  Joint: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
                  Aamir: 'bg-[#3B82F6]/10 text-[#3B82F6]',
                  Taher: 'bg-[#F59E0B]/10 text-[#F59E0B]'
                };
                return <tr key={plot.id} className="hover:bg-[#F5F3EF] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-[#1E5F46]">{plot.name}</p>
                            <p className="text-xs text-[#1E5F46]/50">{plot.plotNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#1E5F46]/70">{plot.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${ownerColors[plot.owner as keyof typeof ownerColors]}`}>
                            {plot.owner}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-[#1E5F46]">
                          {formatCurrency(plot.value)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#1E5F46]/70">
                          {plot.area.toLocaleString()} sq.ft
                        </td>
                        <td className="px-6 py-4 text-center">
                          {plot.completionStatus === 'complete' ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Complete
                            </span> : <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-semibold">
                              <AlertCircle className="w-3 h-3" />
                              Incomplete
                            </span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleUpdateClick(plot)} className="px-3 py-1 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded text-xs font-medium hover:shadow-lg transition-all">
                            Update
                          </button>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>}
        </div>
      </div>

      {/* Update Property Modal */}
      {selectedPlot && <UpdatePropertyModal plot={selectedPlot} isOpen={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      setSelectedPlot(null);
    }} />}
    </div>;
};
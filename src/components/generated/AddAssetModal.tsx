"use client";

import React, { useState } from 'react';
import { X, Building2, TrendingUp, Briefcase, Car, Gem, Landmark, Upload, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type AssetCategory = 'real-estate' | 'bank-account' | 'investment' | 'business' | 'vehicle' | 'other';
type Owner = 'aamir' | 'zanulda' | 'taher' | 'joint';
interface OwnershipData {}
interface UploadedFile {
  name: string;
  size: number;
}
interface CategoryOption {
  id: AssetCategory;
  icon: React.ReactNode;
  name: string;
  description: string;
}

// --- Constants ---

const CATEGORIES: CategoryOption[] = [{
  id: 'real-estate',
  icon: <Building2 className="w-8 h-8" />,
  name: 'Real Estate / Land',
  description: 'Properties, plots, buildings'
}, {
  id: 'bank-account',
  icon: <Landmark className="w-8 h-8" />,
  name: 'Bank Account',
  description: 'Savings, checking, deposits'
}, {
  id: 'investment',
  icon: <TrendingUp className="w-8 h-8" />,
  name: 'Investment Account',
  description: 'Stocks, bonds, funds'
}, {
  id: 'business',
  icon: <Briefcase className="w-8 h-8" />,
  name: 'Operating Business',
  description: 'Companies, ventures'
}, {
  id: 'vehicle',
  icon: <Car className="w-8 h-8" />,
  name: 'Vehicle',
  description: 'Cars, boats, aircraft'
}, {
  id: 'other',
  icon: <Gem className="w-8 h-8" />,
  name: 'Other Assets',
  description: 'Jewelry, art, collectibles'
}];
const OWNERS = [{
  id: 'aamir' as Owner,
  name: 'Aamir'
}, {
  id: 'zanulda' as Owner,
  name: 'Zanulda'
}, {
  id: 'taher' as Owner,
  name: 'Taher'
}, {
  id: 'joint' as Owner,
  name: 'Joint'
}] as any[];

// --- Component ---

export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}
export const AddAssetModal = ({
  isOpen,
  onClose,
  onSubmit
}: AddAssetModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [ownership, setOwnership] = useState<OwnershipData>({});
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [titleDeedFile, setTitleDeedFile] = useState<File | null>(null);
  const [mukiyaFile, setMukiyaFile] = useState<File | null>(null);

  // Calculate ownership total
  const ownershipTotal = Object.values(ownership).reduce((sum, val) => sum + (val || 0), 0);
  const isOwnershipValid = ownershipTotal === 100;
  const handleOwnerToggle = (ownerId: Owner) => {
    const newOwnership = {
      ...ownership
    };
    if (ownerId in newOwnership) {
      delete newOwnership[ownerId];
    } else {
      newOwnership[ownerId] = 0;
    }
    setOwnership(newOwnership);
  };
  const handleOwnershipChange = (ownerId: Owner, value: string) => {
    const numValue = parseFloat(value) || 0;
    setOwnership({
      ...ownership,
      [ownerId]: numValue
    });
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size
      }));
      setFiles([...files, ...newFiles]);
    }
  };
  const removeFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
  };
  const handleSubmit = () => {
    if (!isOwnershipValid) return;
    const data = {
      category: selectedCategory,
      formData,
      ownership,
      files,
      titleDeedFile,
      mukiyaFile
    };
    onSubmit?.(data);
    console.log('Asset data submitted:', data);

    // Reset form
    setSelectedCategory(null);
    setOwnership({});
    setFiles([]);
    setFormData({});
    setTitleDeedFile(null);
    setMukiyaFile(null);
    onClose();
  };
  const handleClose = () => {
    if (selectedCategory || Object.keys(ownership).length > 0) {
      if (confirm('Are you sure you want to close? All unsaved data will be lost.')) {
        setSelectedCategory(null);
        setOwnership({});
        setFiles([]);
        setFormData({});
        setTitleDeedFile(null);
        setMukiyaFile(null);
        onClose();
      }
    } else {
      onClose();
    }
  };
  const renderInfoBanner = () => {
    const banners = {
      'real-estate': {
        icon: '🏡',
        title: 'Real Estate / Land',
        description: 'Add property or land assets to track real estate holdings'
      },
      'bank-account': {
        icon: '🏦',
        title: 'Bank Account',
        description: 'Add a bank account to track liquidity and cash positions'
      },
      'investment': {
        icon: '📈',
        title: 'Investment Account',
        description: 'Track stocks, bonds, mutual funds, and other securities'
      },
      'business': {
        icon: '💼',
        title: 'Operating Business',
        description: 'Add business entities, companies, and ventures to your portfolio'
      },
      'vehicle': {
        icon: '🚗',
        title: 'Vehicle',
        description: 'Add cars, boats, or aircraft to track depreciating assets'
      },
      'other': {
        icon: '💎',
        title: 'Other Assets',
        description: 'Track jewelry, art, collectibles, and other valuables'
      }
    };
    const banner = selectedCategory ? banners[selectedCategory] : null;
    if (!banner) return null;
    return <div className="bg-[#EFF6FF] border-l-4 border-[#3B82F6] rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{banner.icon}</span>
          <div>
            <div className="text-sm font-bold text-[#1F2937] mb-1">{banner.title}</div>
            <div className="text-xs text-[#6B7280]">{banner.description}</div>
          </div>
        </div>
      </div>;
  };
  const renderRealEstateForm = () => <>
      {/* Section 1: Property Information */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Property Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Property Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Al Barsha Villa" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              propertyName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Property Type <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              propertyType: e.target.value
            })}>
                <option value="">Select type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Location <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="City, Area" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              location: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Plot/Unit Number
              </label>
              <input type="text" placeholder="e.g., Plot 123" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              plotNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Area (sq ft)
              </label>
              <input type="number" placeholder="0" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              area: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              purchaseDate: e.target.value
            })} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Valuation */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Valuation</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Price <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                purchasePrice: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Market Value <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentValue: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Last Valuation Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              valuationDate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Annual Rental Income
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                rentalIncome: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1.5">If property is rented out</p>
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderBankAccountForm = () => <>
      {/* Section 1: Account Information */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Account Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Account Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Primary Savings" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              accountName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Bank Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Emirates NBD" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              bankName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Account Number
              </label>
              <input type="text" placeholder="XXXX-XXXX-XXXX" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              accountNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Account Type <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              accountType: e.target.value
            })}>
                <option value="">Select type</option>
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="fixed-deposit">Fixed Deposit</option>
                <option value="money-market">Money Market</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Currency <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              currency: e.target.value
            })}>
                <option value="">Select currency</option>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Balance <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentBalance: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Interest Rate (%)
              </label>
              <input type="number" step="0.01" placeholder="0.00" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              interestRate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Account Opening Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              openingDate: e.target.value
            })} />
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderInvestmentForm = () => <>
      {/* Section 1: Account Details */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Account Details</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Investment Account Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Equity Portfolio" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              investmentName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Broker/Platform <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Interactive Brokers" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              broker: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Account Number
              </label>
              <input type="text" placeholder="Account ID" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              accountNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Investment Type <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              investmentType: e.target.value
            })}>
                <option value="">Select type</option>
                <option value="stocks">Stocks/Equities</option>
                <option value="bonds">Bonds</option>
                <option value="mutual-funds">Mutual Funds</option>
                <option value="etfs">ETFs</option>
                <option value="cryptocurrency">Cryptocurrency</option>
                <option value="mixed">Mixed Portfolio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Initial Investment <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                initialInvestment: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Investment Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              investmentDate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Value <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentValue: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Last Updated
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              lastUpdated: e.target.value
            })} />
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderBusinessForm = () => <>
      {/* Section 1: Business Information */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Business Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Business Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Tech Solutions LLC" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              businessName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Trade License Number
              </label>
              <input type="text" placeholder="License No." className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              licenseNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Industry/Sector <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Technology" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              industry: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Entity Type
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              entityType: e.target.value
            })}>
                <option value="">Select type</option>
                <option value="llc">LLC</option>
                <option value="free-zone">Free Zone</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Initial Investment/Capital <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                initialInvestment: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Establishment Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              establishmentDate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Valuation <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentValuation: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Annual Revenue
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                annualRevenue: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderVehicleForm = () => <>
      {/* Section 1: Vehicle Details */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Vehicle Details</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Vehicle Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., BMW X5 2023" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              vehicleName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Vehicle Type <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              vehicleType: e.target.value
            })}>
                <option value="">Select type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="boat">Boat</option>
                <option value="aircraft">Aircraft</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Make
              </label>
              <input type="text" placeholder="e.g., BMW" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              make: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Model
              </label>
              <input type="text" placeholder="e.g., X5" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              model: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Year
              </label>
              <input type="number" placeholder="2023" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              year: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Registration Number
              </label>
              <input type="text" placeholder="Plate number" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              registrationNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Price <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                purchasePrice: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              purchaseDate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Value <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentValue: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Outstanding Loan
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                outstandingLoan: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderOtherAssetsForm = () => <>
      {/* Section 1: Asset Information */}
      <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Asset Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Asset Name <span className="text-[#EF4444]">*</span>
              </label>
              <input type="text" placeholder="e.g., Rolex Watch" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              assetName: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Asset Category <span className="text-[#EF4444]">*</span>
              </label>
              <select className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              assetCategory: e.target.value
            })}>
                <option value="">Select category</option>
                <option value="jewelry">Jewelry</option>
                <option value="art">Art</option>
                <option value="collectibles">Collectibles</option>
                <option value="precious-metals">Precious Metals</option>
                <option value="watches">Watches</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              Description
            </label>
            <input type="text" placeholder="Brief description of the asset" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Price <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                purchasePrice: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Purchase Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              purchaseDate: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Current Valuation <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full pl-12 pr-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
                ...formData,
                currentValuation: e.target.value
              })} />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">AED</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Valuation Date
              </label>
              <input type="date" className="w-full px-3.5 py-3.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] transition-all" onChange={e => setFormData({
              ...formData,
              valuationDate: e.target.value
            })} />
            </div>
          </div>
        </div>
      </div>
    </>;
  const renderOwnershipSection = () => <div className="bg-[#F5F3EF] rounded-xl p-6 mb-6">
      <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Ownership</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OWNERS.map(owner => {
        const isSelected = owner.id in ownership;
        return <div key={owner.id} className={`p-4 border-2 rounded-lg transition-all ${isSelected ? 'border-[#1E5F46] bg-[#F0FDF4]' : 'border-[#E5E7EB] bg-white'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input type="checkbox" checked={isSelected} onChange={() => handleOwnerToggle(owner.id)} className="w-5 h-5 rounded border-[#E5E7EB] text-[#1E5F46] focus:ring-[#1E5F46] cursor-pointer" />
                <span className="font-semibold text-[#1F2937]">{owner.name}</span>
              </div>
              <input type="number" min="0" max="100" placeholder="%" disabled={!isSelected} value={ownership[owner.id] || ''} onChange={e => handleOwnershipChange(owner.id, e.target.value)} className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1E5F46] focus:shadow-[0_0_0_3px_rgba(30,95,70,0.1)] disabled:bg-[#F5F3EF] disabled:cursor-not-allowed transition-all" />
            </div>;
      })}
      </div>
    </div>;
  const renderDocumentSection = () => {
    const documentPrompts = {
      'real-estate': 'Title Deed, Mulkiya, Purchase Agreement',
      'bank-account': 'Bank Statements, Account Opening Documents',
      'investment': 'Statements, Trade Confirmations, Certificates',
      'business': 'Trade License, MOA, Financial Statements',
      'vehicle': 'Registration Card, Insurance, Purchase Agreement',
      'other': 'Certificates, Appraisals, Purchase Receipts'
    };
    const promptText = selectedCategory ? documentPrompts[selectedCategory] : '';
    if (selectedCategory === 'real-estate') {
      return <div className="bg-[#F5F3EF] rounded-xl p-6">
          <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Deed */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Title Deed (ملكية)
              </label>
              <div className="relative">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setTitleDeedFile(file);
                }
              }} className="hidden" id="titleDeedUpload" />
                <label htmlFor="titleDeedUpload" className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] hover:bg-[#F9FAFB] transition-colors cursor-pointer bg-white">
                  <Upload className="w-4 h-4" />
                  Choose Title Deed File
                </label>
              </div>
              <p className={`text-xs mt-2 font-medium ${titleDeedFile ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                Current status: {titleDeedFile ? '✓ Uploaded' : '⚠ Not Uploaded'}
              </p>
              {titleDeedFile && <div className="mt-2 p-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <p className="text-xs text-[#1F2937] truncate">📎 {titleDeedFile.name}</p>
                </div>}
            </div>

            {/* Mulkiya */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Mulkiya (استمارة)
              </label>
              <div className="relative">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setMukiyaFile(file);
                }
              }} className="hidden" id="mukiyaUpload" />
                <label htmlFor="mukiyaUpload" className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#1F2937] hover:bg-[#F9FAFB] transition-colors cursor-pointer bg-white">
                  <Upload className="w-4 h-4" />
                  Choose Mulkiya File
                </label>
              </div>
              <p className={`text-xs mt-2 font-medium ${mukiyaFile ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                Current status: {mukiyaFile ? '✓ Uploaded' : '⚠ Not Uploaded'}
              </p>
              {mukiyaFile && <div className="mt-2 p-2 bg-white border border-[#E5E7EB] rounded-lg">
                  <p className="text-xs text-[#1F2937] truncate">📎 {mukiyaFile.name}</p>
                </div>}
            </div>
          </div>
        </div>;
    }
    return <div className="bg-[#F5F3EF] rounded-xl p-6">
        <h3 className="text-[1.1rem] font-bold text-[#1F2937] mb-4">Documents</h3>
        <div className="relative">
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="file-upload" />
          <label htmlFor="file-upload" className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center cursor-pointer hover:border-[#1E5F46] hover:bg-[#F9FAFB] transition-all bg-white block">
            <div className="text-2xl mb-3">📄</div>
            <div className="text-sm font-bold text-[#1F2937] mb-1">Click to upload documents</div>
            <div className="text-xs text-[#6B7280]">
              {promptText} (PDF, JPG, PNG up to 10MB)
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && <div className="mt-4 space-y-2">
            {files.map((file, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#E5E7EB] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1F2937] truncate">📎 {file.name}</p>
                  <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => removeFile(file.name)} className="text-xs font-semibold text-[#EF4444] hover:text-[#DC2626] ml-3 cursor-pointer">
                  Remove
                </button>
              </div>)}
          </div>}
      </div>;
  };
  if (!isOpen) return null;
  return <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Add New Asset</h2>
                <p className="text-sm opacity-90">
                  Select asset type and enter details to add to your portfolio
                </p>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1E5F46] mb-4">Select Asset Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map(category => <motion.div key={category.id} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setSelectedCategory(category.id)} className={`p-5 border-2 rounded-xl cursor-pointer transition-all text-center ${selectedCategory === category.id ? 'border-[#1E5F46] bg-[#10B981]/5 shadow-md' : 'border-[#1E5F46]/10 hover:border-[#1E5F46]/30 hover:shadow-sm'}`}>
                    <div className={`mb-3 flex justify-center ${selectedCategory === category.id ? 'text-[#1E5F46]' : 'text-[#1E5F46]/60'}`}>
                      {category.icon}
                    </div>
                    <div className="text-sm font-bold text-[#1E5F46] mb-1">
                      {category.name}
                    </div>
                    <div className="text-xs text-[#1E5F46]/60">
                      {category.description}
                    </div>
                    {selectedCategory === category.id && <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} className="mt-3 w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>}
                  </motion.div>)}
              </div>
            </div>

            {/* Form Fields (Only if category selected) */}
            {selectedCategory && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="space-y-6">
                {renderInfoBanner()}

                {selectedCategory === 'real-estate' && renderRealEstateForm()}
                {selectedCategory === 'bank-account' && renderBankAccountForm()}
                {selectedCategory === 'investment' && renderInvestmentForm()}
                {selectedCategory === 'business' && renderBusinessForm()}
                {selectedCategory === 'vehicle' && renderVehicleForm()}
                {selectedCategory === 'other' && renderOtherAssetsForm()}

                {renderOwnershipSection()}
                {renderDocumentSection()}
              </motion.div>}
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {selectedCategory && <span className={`font-semibold ${isOwnershipValid ? 'text-[#10B981]' : ownershipTotal > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                    Ownership Total: {ownershipTotal}%
                    {isOwnershipValid && ' ✓'}
                  </span>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleClose} className="px-8 py-3.5 border border-[#E5E7EB] rounded-lg text-sm font-semibold text-[#1F2937] hover:bg-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={!isOwnershipValid || !selectedCategory} className="px-8 py-3.5 bg-[#1E5F46] text-white rounded-lg text-sm font-semibold hover:bg-[#166534] transition-all disabled:bg-[#6B7280] disabled:cursor-not-allowed">
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>;
};
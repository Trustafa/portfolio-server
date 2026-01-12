import { Asset, VehicleAsset, AssetOwnership, User, RealEstateAsset, BankAccountAsset, BusinessAsset, InvestmentAsset, OtherAsset, AssetCategory } from "../generated/prisma/client";

export type OwnershipResponse = {
  userId: string;
  name?: string | null;
  percentage: number;
};

export function toOwnershipResponse(
  ownership: AssetOwnership & { user?: User | null }
): OwnershipResponse {
  if (!ownership.user) {
    return {
      userId: ownership.userId ?? "", // fallback if somehow null
      name: null,
      percentage: ownership.percentage,
    };
  }

  return {
    userId: ownership.user.id,
    name: ownership.user.name,
    percentage: ownership.percentage,
  };
}

export type VehicleAssetResponse = {
  id: string;
  category: string;

  vehicle: {
    vehicleName: string;
    vehicleType: string;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    registrationNumber?: string | null;
    purchasePrice: number;
    purchaseDate?: string | null;
    currentValue: number;
    outstandingLoan?: number | null;
  };

  owners: {
    userId: string;
    name?: string | null;
    percentage: number;
  }[];

  createdAt: string;
  updatedAt: string;
};

export function toVehicleResponse(
  asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  vehicle: VehicleAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}
): VehicleAssetResponse {
  return {
    id: asset.id,
    category: asset.category,
    vehicle: {
      vehicleName: asset.vehicle.vehicleName,
      vehicleType: asset.vehicle.vehicleType,
      make: asset.vehicle.make,
      model: asset.vehicle.model,
      year: asset.vehicle.year,
      registrationNumber: asset.vehicle.registrationNumber,
      purchasePrice: asset.vehicle.purchasePrice,
      purchaseDate: asset.vehicle.purchaseDate?.toISOString() ?? null,
      currentValue: asset.vehicle.currentValue,
      outstandingLoan: asset.vehicle.outstandingLoan,
    },
    owners: asset.ownerships.filter(o => o.userId).map(o => ({
      userId: o.userId!,
      name: o.user?.name ?? null,
      percentage: o.percentage,
    })),
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

// ------------------- Real Estate -------------------
export type RealEstateAssetResponse = {
  id: string;
  assetId: string;
  propertyName: string;
  propertyType: string;
  location: string;
  plotNumber?: string | null;
  areaSqFt?: number | null;
  purchaseDate?: string | null;
  purchasePrice: number;
  currentValue: number;
  valuationDate?: string | null;
  rentalIncome?: number | null;

  ownerships: OwnershipResponse[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function toRealEstateAssetResponse(
asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  realEstate: RealEstateAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}): RealEstateAssetResponse {
  if (!asset.realEstate) throw new Error("No real estate asset data found");
  return {
    id: asset.realEstate.id,
    assetId: asset.id,
    propertyName: asset.realEstate.propertyName,
    propertyType: asset.realEstate.propertyType,
    location: asset.realEstate.location,
    plotNumber: asset.realEstate.plotNumber,
    areaSqFt: asset.realEstate.areaSqFt,
    purchaseDate: asset.realEstate.purchaseDate?.toISOString() ?? null,
    purchasePrice: asset.realEstate.purchasePrice,
    currentValue: asset.realEstate.currentValue,
    valuationDate: asset.realEstate.valuationDate?.toISOString() ?? null,
    rentalIncome: asset.realEstate.rentalIncome,
    ownerships: asset.ownerships.map(toOwnershipResponse),
    createdAt: asset.realEstate.createdAt.toISOString(),
    updatedAt: asset.realEstate.updatedAt.toISOString(),
    deletedAt: asset.realEstate.deletedAt?.toISOString() ?? null,
  };
}

// ------------------- Bank Account -------------------
export type BankAccountAssetResponse = {
  id: string;
  assetId: string;
  accountName: string;
  bankName: string;
  accountNumber?: string | null;
  accountType: string;
  currentBalance: number;
  interestRate?: number | null;
  openingDate?: string | null;

  ownerships: OwnershipResponse[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function toBankAccountAssetResponse(
asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  bankAccount: BankAccountAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}): BankAccountAssetResponse {
  if (!asset.bankAccount) throw new Error("No bank account asset data found");
  return {
    id: asset.bankAccount.id,
    assetId: asset.id,
    accountName: asset.bankAccount.accountName,
    bankName: asset.bankAccount.bankName,
    accountNumber: asset.bankAccount.accountNumber,
    accountType: asset.bankAccount.accountType,
    currentBalance: asset.bankAccount.currentBalance,
    interestRate: asset.bankAccount.interestRate,
    openingDate: asset.bankAccount.openingDate?.toISOString() ?? null,
    ownerships: asset.ownerships.map(toOwnershipResponse),
    createdAt: asset.bankAccount.createdAt.toISOString(),
    updatedAt: asset.bankAccount.updatedAt.toISOString(),
    deletedAt: asset.bankAccount.deletedAt?.toISOString() ?? null,
  };
}

// ------------------- Investment -------------------
export type InvestmentAssetResponse = {
  id: string;
  assetId: string;
  investmentName: string;
  broker: string;
  accountNumber?: string | null;
  investmentType: string;
  initialInvestment: number;
  investmentDate?: string | null;
  currentValue: number;
  lastUpdated?: string | null;

  ownerships: OwnershipResponse[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function toInvestmentAssetResponse(
asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  investment: InvestmentAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}): InvestmentAssetResponse {
  if (!asset.investment) throw new Error("No investment asset data found");
  return {
    id: asset.investment.id,
    assetId: asset.id,
    investmentName: asset.investment.investmentName,
    broker: asset.investment.broker,
    accountNumber: asset.investment.accountNumber,
    investmentType: asset.investment.investmentType,
    initialInvestment: asset.investment.initialInvestment,
    investmentDate: asset.investment.investmentDate?.toISOString() ?? null,
    currentValue: asset.investment.currentValue,
    lastUpdated: asset.investment.lastUpdated?.toISOString() ?? null,
    ownerships: asset.ownerships.map(toOwnershipResponse),
    createdAt: asset.investment.createdAt.toISOString(),
    updatedAt: asset.investment.updatedAt.toISOString(),
    deletedAt: asset.investment.deletedAt?.toISOString() ?? null,
  };
}

// ------------------- Business -------------------
export type BusinessAssetResponse = {
  id: string;
  assetId: string;
  businessName: string;
  licenseNumber?: string | null;
  industry: string;
  entityType?: string | null;
  initialInvestment: number;
  establishmentDate?: string | null;
  currentValuation: number;
  annualRevenue?: number | null;

  ownerships: OwnershipResponse[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function toBusinessAssetResponse(
asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  business: BusinessAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}): BusinessAssetResponse {
  if (!asset.business) throw new Error("No business asset data found");
  return {
    id: asset.business.id,
    assetId: asset.id,
    businessName: asset.business.businessName,
    licenseNumber: asset.business.licenseNumber,
    industry: asset.business.industry,
    entityType: asset.business.entityType,
    initialInvestment: asset.business.initialInvestment,
    establishmentDate: asset.business.establishmentDate?.toISOString() ?? null,
    currentValuation: asset.business.currentValuation,
    annualRevenue: asset.business.annualRevenue,
    ownerships: asset.ownerships.map(toOwnershipResponse),
    createdAt: asset.business.createdAt.toISOString(),
    updatedAt: asset.business.updatedAt.toISOString(),
    deletedAt: asset.business.deletedAt?.toISOString() ?? null,
  };
}

// ------------------- Other -------------------
export type OtherAssetResponse = {
  id: string;
  assetId: string;
  assetName: string;
  assetCategory: string;
  description?: string | null;
  purchasePrice: number;
  purchaseDate?: string | null;
  currentValuation: number;
  valuationDate?: string | null;

  ownerships: OwnershipResponse[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function toOtherAssetResponse(
asset: {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
  otherAsset: OtherAsset;
  ownerships: (AssetOwnership & { user?: User | null })[];
}): OtherAssetResponse {
  if (!asset.otherAsset) throw new Error("No other asset data found");
  return {
    id: asset.otherAsset.id,
    assetId: asset.id,
    assetName: asset.otherAsset.assetName,
    assetCategory: asset.otherAsset.assetCategory,
    description: asset.otherAsset.description,
    purchasePrice: asset.otherAsset.purchasePrice,
    purchaseDate: asset.otherAsset.purchaseDate?.toISOString() ?? null,
    currentValuation: asset.otherAsset.currentValuation,
    valuationDate: asset.otherAsset.valuationDate?.toISOString() ?? null,
    ownerships: asset.ownerships.map(toOwnershipResponse),
    createdAt: asset.otherAsset.createdAt.toISOString(),
    updatedAt: asset.otherAsset.updatedAt.toISOString(),
    deletedAt: asset.otherAsset.deletedAt?.toISOString() ?? null,
  };
}

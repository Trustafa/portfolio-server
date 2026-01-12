import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { findLoggedInUser } from "../services/auth.service";
import { validateOwners } from "../services/asset.service";

const ownerSchema = z.object({
  userId: z.string(),
  percentage: z.number().min(0).max(100),
});

const createVehicleSchema = z.object({
  vehicleName: z.string(),
  vehicleType: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  registrationNumber: z.string().optional(),
  purchasePrice: z.number(),
  purchaseDate: z.string().optional(),
  currentValue: z.number(),
  outstandingLoan: z.number().optional(),
  owners: z.array(ownerSchema).min(1),
});


export async function createVehicleAsset(req: Request, res: Response) {
  const loggedInUser = await findLoggedInUser(req);
  if (!loggedInUser) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createVehicleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const data = parsed.data;
  const { owners, ...vehicleData } = data;


  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: {
          familyId: loggedInUser.familyId,
          category: "VEHICLE",
        },
      });

      await tx.vehicleAsset.create({
        data: {
          assetId: asset.id,
          ...vehicleData,
          purchaseDate: data.purchaseDate
            ? new Date(data.purchaseDate)
            : undefined,
        },
      });

      await validateOwners(tx, loggedInUser.familyId, data.owners);

      await tx.assetOwnership.createMany({
        data: data.owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    return res.status(201).json({ assetId: asset.id });
  } catch (err:any) {
    return res.status(400).json({ error: err.message });
  }
}

const createRealEstateSchema = z.object({
  propertyName: z.string(),
  propertyType: z.string(),
  location: z.string(),
  plotNumber: z.string().optional(),
  areaSqFt: z.number().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number(),
  currentValue: z.number(),
  valuationDate: z.string().optional(),
  rentalIncome: z.number().optional(),
  owners: z.array(ownerSchema).min(1),
});

export async function createRealEstateAsset(req: Request, res: Response) {
  const user = await findLoggedInUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createRealEstateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { owners, ...data } = parsed.data;

  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: { familyId: user.familyId, category: "REAL_ESTATE" },
      });

      await tx.realEstateAsset.create({
        data: {
          assetId: asset.id,
          ...data,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
          valuationDate: data.valuationDate ? new Date(data.valuationDate) : undefined,
        },
      });

      await validateOwners(tx, user.familyId, owners);

      await tx.assetOwnership.createMany({
        data: owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    res.status(201).json({ assetId: asset.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

const createBankSchema = z.object({
  accountName: z.string(),
  bankName: z.string(),
  accountNumber: z.string().optional(),
  accountType: z.string(),
  currentBalance: z.number(),
  interestRate: z.number().optional(),
  openingDate: z.string().optional(),
  owners: z.array(ownerSchema).min(1),
});

export async function createBankAccountAsset(req: Request, res: Response) {
  const user = await findLoggedInUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createBankSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { owners, ...data } = parsed.data;

  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: { familyId: user.familyId, category: "BANK_ACCOUNT" },
      });

      await tx.bankAccountAsset.create({
        data: {
          assetId: asset.id,
          ...data,
          openingDate: data.openingDate ? new Date(data.openingDate) : undefined,
        },
      });

      await validateOwners(tx, user.familyId, owners);

      await tx.assetOwnership.createMany({
        data: owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    res.status(201).json({ assetId: asset.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

const createInvestmentSchema = z.object({
  investmentName: z.string(),
  broker: z.string(),
  accountNumber: z.string().optional(),
  investmentType: z.string(),
  initialInvestment: z.number(),
  investmentDate: z.string().optional(),
  currentValue: z.number(),
  lastUpdated: z.string().optional(),
  owners: z.array(ownerSchema).min(1),
});

export async function createInvestmentAsset(req: Request, res: Response) {
  const user = await findLoggedInUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createInvestmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { owners, ...data } = parsed.data;

  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: { familyId: user.familyId, category: "INVESTMENT" },
      });

      await tx.investmentAsset.create({
        data: {
          assetId: asset.id,
          ...data,
          investmentDate: data.investmentDate ? new Date(data.investmentDate) : undefined,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined,
        },
      });

      await validateOwners(tx, user.familyId, owners);

      await tx.assetOwnership.createMany({
        data: owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    res.status(201).json({ assetId: asset.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

const createBusinessSchema = z.object({
  businessName: z.string(),
  licenseNumber: z.string().optional(),
  industry: z.string(),
  entityType: z.string().optional(),
  initialInvestment: z.number(),
  establishmentDate: z.string().optional(),
  currentValuation: z.number(),
  annualRevenue: z.number().optional(),
  owners: z.array(ownerSchema).min(1),
});

export async function createBusinessAsset(req: Request, res: Response) {
  const user = await findLoggedInUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createBusinessSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { owners, ...data } = parsed.data;

  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: { familyId: user.familyId, category: "BUSINESS" },
      });

      await tx.businessAsset.create({
        data: {
          assetId: asset.id,
          ...data,
          establishmentDate: data.establishmentDate
            ? new Date(data.establishmentDate)
            : undefined,
        },
      });

      await validateOwners(tx, user.familyId, owners);

      await tx.assetOwnership.createMany({
        data: owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    res.status(201).json({ assetId: asset.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

const createOtherSchema = z.object({
  assetName: z.string(),
  assetCategory: z.string(),
  description: z.string().optional(),
  purchasePrice: z.number(),
  purchaseDate: z.string().optional(),
  currentValuation: z.number(),
  valuationDate: z.string().optional(),
  owners: z.array(ownerSchema).min(1),
});

export async function createOtherAsset(req: Request, res: Response) {
  const user = await findLoggedInUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createOtherSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { owners, ...data } = parsed.data;

  try {
    const asset = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: { familyId: user.familyId, category: "OTHER" },
      });

      await tx.otherAsset.create({
        data: {
          assetId: asset.id,
          ...data,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
          valuationDate: data.valuationDate ? new Date(data.valuationDate) : undefined,
        },
      });

      await validateOwners(tx, user.familyId, owners);

      await tx.assetOwnership.createMany({
        data: owners.map(o => ({
          assetId: asset.id,
          userId: o.userId,
          percentage: o.percentage,
        })),
      });

      return asset;
    });

    res.status(201).json({ assetId: asset.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}


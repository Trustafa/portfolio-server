import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { findLoggedInUser } from "../services/auth.service";

const ownerSchema = z.object({
  userId: z.string().uuid(),
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

  if (!loggedInUser) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const parsed = createVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const data = parsed.data;

  // Ensure total ownership = 100
  const total = data.owners.reduce((sum, o) => sum + o.percentage, 0);
  if (total !== 100) {
    return res.status(400).json({ error: "Ownership must total 100%" });
  }

  try {
    const asset = await prisma.$transaction(async (tx) => {
      // 1. Create asset
      const asset = await tx.asset.create({
        data: {
          familyId: loggedInUser.familyId,
          category: "VEHICLE",
        },
      });

      // 2. Create vehicle details
      await tx.vehicleAsset.create({
        data: {
          assetId: asset.id,
          vehicleName: data.vehicleName,
          vehicleType: data.vehicleType,
          make: data.make,
          model: data.model,
          year: data.year,
          registrationNumber: data.registrationNumber,
          purchasePrice: data.purchasePrice,
          purchaseDate: data.purchaseDate
            ? new Date(data.purchaseDate)
            : undefined,
          currentValue: data.currentValue,
          outstandingLoan: data.outstandingLoan,
        },
      });

      // 3. Validate owners belong to same family
      const familyUsers = await tx.user.findMany({
        where: {
          familyId: loggedInUser.familyId,
          id: { in: data.owners.map(o => o.userId) },
        },
        select: { id: true },
      });

      if (familyUsers.length !== data.owners.length) {
        throw new Error("One or more owners not in family");
      }

      // 4. Create ownership rows
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

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create vehicle asset" });
  }
}

export async function getVehicleAssets(req: Request, res: Response) {
  const user = await findLoggedInUser(req);

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const assets = await prisma.asset.findMany({
    where: {
      familyId: user.familyId,
      category: "VEHICLE",
      deletedAt: null,
    },
    include: {
      vehicle: true,
      ownerships: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  // Shape clean response
  const response = assets.map(a => ({
    id: a.id,
    category: a.category,
    vehicle: a.vehicle,
    owners: a.ownerships.map(o => ({
      userId: o.userId,
      name: o.user?.name,
      percentage: o.percentage,
    })),
    createdAt: a.createdAt,
  }));

  return res.json(response);
}



// src/routes/asset.routes.ts
import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { createVehicleAsset } from "../controllers/vehicleAsset.controller";

import {
  toVehicleResponse,
  toRealEstateAssetResponse,
  toBankAccountAssetResponse,
  toInvestmentAssetResponse,
  toBusinessAssetResponse,
  toOtherAssetResponse,
} from "../services/asset.service";

const router = Router();

// GET /api/asset/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        ownerships: { include: { user: true } },
        realEstate: true,
        vehicle: true,
        bankAccount: true,
        investment: true,
        business: true,
        otherAsset: true,
        documents: true,
      },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    let response;

    switch (asset.category) {
  case "VEHICLE":
    if (!asset.vehicle) {
      return res.status(400).json({ error: "Vehicle data missing" });
    }

    response = toVehicleResponse({
      id: asset.id,
      category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      vehicle: asset.vehicle,
      ownerships: asset.ownerships,
    });
    break;

  case "REAL_ESTATE":
    if (!asset.realEstate) {
      return res.status(400).json({ error: "Real estate data missing" });
    }

    response = toRealEstateAssetResponse({
      id: asset.id,
      category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      realEstate: asset.realEstate,
      ownerships: asset.ownerships,
    });
    break;

  case "BANK_ACCOUNT":
    if (!asset.bankAccount) {
      return res.status(400).json({ error: "Bank account data missing" });
    }

    response = toBankAccountAssetResponse({
      id: asset.id,
            category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      ownerships: asset.ownerships,
      bankAccount: asset.bankAccount,
    });
    break;

  case "INVESTMENT":
    if (!asset.investment) {
      return res.status(400).json({ error: "Investment data missing" });
    }

    response = toInvestmentAssetResponse({
      id: asset.id,
            category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      ownerships: asset.ownerships,
      investment: asset.investment,
    });
    break;

  case "BUSINESS":
    if (!asset.business) {
      return res.status(400).json({ error: "Business data missing" });
    }

    response = toBusinessAssetResponse({
      id: asset.id,
            category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      ownerships: asset.ownerships,
      business: asset.business,
    });
    break;

  case "OTHER":
    if (!asset.otherAsset) {
      return res.status(400).json({ error: "Other asset data missing" });
    }

    response = toOtherAssetResponse({
      id: asset.id,
      category: asset.category,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      ownerships: asset.ownerships,
      otherAsset: asset.otherAsset,
    });
    break;

  default:
    return res.status(500).json({ error: "Unknown asset category" });
}

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vehicle", createVehicleAsset);

export default router;

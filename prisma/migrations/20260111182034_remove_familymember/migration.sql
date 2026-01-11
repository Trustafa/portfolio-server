-- CreateEnum
CREATE TYPE "AssetDocumentType" AS ENUM ('MULKIYA', 'TITLE_DEED', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('REAL_ESTATE', 'BANK_ACCOUNT', 'INVESTMENT', 'BUSINESS', 'VEHICLE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMPTZ,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetOwnership" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" UUID,

    CONSTRAINT "AssetOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "plotNumber" TEXT,
    "areaSqFt" DOUBLE PRECISION,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "valuationDate" TIMESTAMP(3),
    "rentalIncome" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RealEstateAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccountAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT,
    "accountType" TEXT NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "openingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BankAccountAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "investmentName" TEXT NOT NULL,
    "broker" TEXT NOT NULL,
    "accountNumber" TEXT,
    "investmentType" TEXT NOT NULL,
    "initialInvestment" DOUBLE PRECISION NOT NULL,
    "investmentDate" TIMESTAMP(3),
    "currentValue" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InvestmentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "industry" TEXT NOT NULL,
    "entityType" TEXT,
    "initialInvestment" DOUBLE PRECISION NOT NULL,
    "establishmentDate" TIMESTAMP(3),
    "currentValuation" DOUBLE PRECISION NOT NULL,
    "annualRevenue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "registrationNumber" TEXT,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "currentValue" DOUBLE PRECISION NOT NULL,
    "outstandingLoan" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetCategory" TEXT NOT NULL,
    "description" TEXT,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "currentValuation" DOUBLE PRECISION NOT NULL,
    "valuationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OtherAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetDocument" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RealEstateAsset_assetId_key" ON "RealEstateAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccountAsset_assetId_key" ON "BankAccountAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAsset_assetId_key" ON "InvestmentAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessAsset_assetId_key" ON "BusinessAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAsset_assetId_key" ON "VehicleAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "OtherAsset_assetId_key" ON "OtherAsset"("assetId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetOwnership" ADD CONSTRAINT "AssetOwnership_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetOwnership" ADD CONSTRAINT "AssetOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstateAsset" ADD CONSTRAINT "RealEstateAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccountAsset" ADD CONSTRAINT "BankAccountAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentAsset" ADD CONSTRAINT "InvestmentAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAsset" ADD CONSTRAINT "BusinessAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAsset" ADD CONSTRAINT "VehicleAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherAsset" ADD CONSTRAINT "OtherAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocument" ADD CONSTRAINT "AssetDocument_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

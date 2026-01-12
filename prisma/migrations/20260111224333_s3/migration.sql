/*
  Warnings:

  - The primary key for the `AssetDocument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileType` on the `AssetDocument` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `AssetDocument` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `AssetDocument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentType` to the `AssetDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `AssetDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3Key` to the `AssetDocument` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `AssetDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AssetDocument" DROP CONSTRAINT "AssetDocument_pkey",
DROP COLUMN "fileType",
DROP COLUMN "fileUrl",
ADD COLUMN     "documentType" "AssetDocumentType" NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "s3Key" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "AssetDocument_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssetDocument_assetId_key" ON "AssetDocument"("assetId");

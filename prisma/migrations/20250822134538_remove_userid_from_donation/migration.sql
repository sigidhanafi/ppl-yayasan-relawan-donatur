/*
  Warnings:

  - You are about to drop the column `userId` on the `Donation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropIndex
DROP INDEX "public"."Donation_userId_idx";

-- AlterTable
ALTER TABLE "public"."Donation" DROP COLUMN "userId";

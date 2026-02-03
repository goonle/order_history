/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `message` table. All the data in the column will be lost.
  - Added the required column `vendor_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_supplier_id_fkey";

-- DropIndex
DROP INDEX "message_supplier_id_idx";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "supplier_id",
ADD COLUMN     "vendor_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "message_vendor_id_idx" ON "message"("vendor_id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

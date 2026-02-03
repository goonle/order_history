/*
  Warnings:

  - You are about to drop the column `body_template` on the `order_channel` table. All the data in the column will be lost.
  - You are about to drop the column `subject_template` on the `order_channel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_channel" DROP CONSTRAINT "order_channel_body_template_fkey";

-- DropForeignKey
ALTER TABLE "order_channel" DROP CONSTRAINT "order_channel_subject_template_fkey";

-- AlterTable
ALTER TABLE "order_channel" DROP COLUMN "body_template",
DROP COLUMN "subject_template",
ADD COLUMN     "template_id" INTEGER;

-- AlterTable
ALTER TABLE "template" ALTER COLUMN "subject" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "default_template_id" INTEGER;

-- CreateIndex
CREATE INDEX "order_channel_template_id_idx" ON "order_channel"("template_id");

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_default_template_id_fkey" FOREIGN KEY ("default_template_id") REFERENCES "template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_channel" ADD CONSTRAINT "order_channel_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

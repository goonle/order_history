/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id]` on the table `vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_id_user_id_key" ON "vendor"("id", "user_id");

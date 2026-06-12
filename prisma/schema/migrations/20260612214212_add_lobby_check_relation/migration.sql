/*
  Warnings:

  - A unique constraint covering the columns `[checkId]` on the table `Lobby` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "checkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_checkId_key" ON "Lobby"("checkId");

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DELETE FROM "cycles" ;
/*
  Warnings:

  - Added the required column `creatorId` to the `cycles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cycles" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

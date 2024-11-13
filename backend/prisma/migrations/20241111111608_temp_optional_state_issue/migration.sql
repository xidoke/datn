-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_stateId_fkey";

-- AlterTable
ALTER TABLE "issues" ALTER COLUMN "stateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

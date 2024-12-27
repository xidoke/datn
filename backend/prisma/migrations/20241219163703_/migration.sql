-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

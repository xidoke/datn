-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

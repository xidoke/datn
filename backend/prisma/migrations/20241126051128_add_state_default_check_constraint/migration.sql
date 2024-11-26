-- DropIndex
DROP INDEX "State_projectId_isDefault_key";

-- CreateIndex
CREATE INDEX "State_projectId_isDefault_idx" ON "State"("projectId", "isDefault");

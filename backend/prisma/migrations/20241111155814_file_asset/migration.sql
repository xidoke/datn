-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "attributes" JSONB NOT NULL,
    "entityType" TEXT NOT NULL,
    "isUploaded" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "storageMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "issueId" TEXT,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileAsset_workspaceId_idx" ON "FileAsset"("workspaceId");

-- CreateIndex
CREATE INDEX "FileAsset_createdById_idx" ON "FileAsset"("createdById");

-- CreateIndex
CREATE INDEX "FileAsset_userId_idx" ON "FileAsset"("userId");

-- CreateIndex
CREATE INDEX "FileAsset_projectId_idx" ON "FileAsset"("projectId");

-- CreateIndex
CREATE INDEX "FileAsset_issueId_idx" ON "FileAsset"("issueId");

-- CreateIndex
CREATE INDEX "FileAsset_entityType_idx" ON "FileAsset"("entityType");

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

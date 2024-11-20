-- CreateTable
CREATE TABLE "WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvitation_email_workspaceId_key" ON "WorkspaceInvitation"("email", "workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

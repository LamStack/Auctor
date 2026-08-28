-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "batchId" TEXT;

-- AlterTable
ALTER TABLE "SkillReport" ADD COLUMN     "seniorityEstimate" TEXT;

-- CreateTable
CREATE TABLE "InviteBatch" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "roleLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteBatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InviteBatch" ADD CONSTRAINT "InviteBatch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteBatch" ADD CONSTRAINT "InviteBatch_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InviteBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "emailTemplate" TEXT;

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "candidateId" TEXT;

-- AlterTable
ALTER TABLE "SkillReport" ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "rankTotal" INTEGER;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'game-world';

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

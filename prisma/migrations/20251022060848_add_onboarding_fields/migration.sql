-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "weeklyDigest" BOOLEAN NOT NULL DEFAULT false;

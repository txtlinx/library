-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('IN_PROGRESS', 'PAUSED', 'COMPLETED');

-- AlterTable
ALTER TABLE "TaskEntry" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'IN_PROGRESS';

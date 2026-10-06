/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Result` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollmentId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollmentId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_subjectId_fkey";

-- DropIndex
DROP INDEX "Result_subjectId_key";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "subjectId",
ADD COLUMN     "enrollmentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Result_enrollmentId_key" ON "Result"("enrollmentId");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,sessionTermId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionTermId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TermName" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- DropIndex
DROP INDEX "Enrollment_studentId_courseId_key";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "sessionTermId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "graduated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "middleName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AcademicSession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AcademicSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionTerm" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "term" "TermName" NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SessionTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicSession_name_key" ON "AcademicSession"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SessionTerm_sessionId_term_key" ON "SessionTerm"("sessionId", "term");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseId_sessionTermId_key" ON "Enrollment"("studentId", "courseId", "sessionTermId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_sessionTermId_fkey" FOREIGN KEY ("sessionTermId") REFERENCES "SessionTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTerm" ADD CONSTRAINT "SessionTerm_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

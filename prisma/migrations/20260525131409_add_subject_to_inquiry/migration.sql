/*
  Warnings:

  - You are about to drop the column `specialRequests` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "subject" TEXT;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "specialRequests";

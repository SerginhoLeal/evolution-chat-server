/*
  Warnings:

  - You are about to drop the column `message_id` on the `friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "message_id",
ADD COLUMN     "type_chat" TEXT;

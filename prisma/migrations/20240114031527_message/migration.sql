/*
  Warnings:

  - You are about to drop the column `last_message` on the `friends` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_friends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "message_id" TEXT,
    CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "friends_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_friends" ("id", "target_id", "user_id") SELECT "id", "target_id", "user_id" FROM "friends";
DROP TABLE "friends";
ALTER TABLE "new_friends" RENAME TO "friends";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

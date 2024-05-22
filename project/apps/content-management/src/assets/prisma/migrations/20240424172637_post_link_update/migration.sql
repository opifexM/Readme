/*
  Warnings:

  - You are about to drop the column `quote_author_id` on the `quote_posts` table. All the data in the column will be lost.
  - Added the required column `author` to the `quote_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quote_posts" DROP COLUMN "quote_author_id",
ADD COLUMN     "author" TEXT NOT NULL;

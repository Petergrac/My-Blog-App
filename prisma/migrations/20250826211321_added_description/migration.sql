/*
  Warnings:

  - Added the required column `coverImage` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Post_accessKey_key";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar" TEXT;

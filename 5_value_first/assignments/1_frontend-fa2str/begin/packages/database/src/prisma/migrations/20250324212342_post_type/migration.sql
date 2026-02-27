/*
  Warnings:

  - Changed the type of `postType` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('link', 'text');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postType",
ADD COLUMN     "postType" "PostType" NOT NULL;

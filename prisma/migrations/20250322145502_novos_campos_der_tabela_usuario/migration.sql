/*
  Warnings:

  - Added the required column `avatar` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `avatar` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "photoUrl" TEXT;

-- CreateIndex
CREATE INDEX "ListItem_categoryId_idx" ON "ListItem"("categoryId");

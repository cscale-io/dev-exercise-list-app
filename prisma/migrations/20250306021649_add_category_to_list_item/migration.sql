ALTER TABLE "ListItem" 
ADD COLUMN "categoryId" UUID NOT NULL, 
ADD CONSTRAINT "fk_listitem_category"
FOREIGN KEY ("categoryId") 
REFERENCES "Category"("id") 
ON DELETE CASCADE;
CREATE TABLE "Category" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "description" VARCHAR(255)
);
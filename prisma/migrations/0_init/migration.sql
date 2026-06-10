-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Marketplace" AS ENUM ('WEIDIAN', 'TAOBAO', '1688', 'OTHER');

-- CreateEnum
CREATE TYPE "Agent" AS ENUM ('OOPBUY', 'KAKOBUY', 'ACBUY', 'ORIENTDIG', 'SUPERBUY', 'BASETAO', 'MULEBUY');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "category" TEXT,
    "tags" TEXT[],
    "marketplace" "Marketplace" NOT NULL DEFAULT 'OTHER',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "agent" "Agent" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "AgentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_published_featured_idx" ON "Product"("published", "featured");

-- CreateIndex
CREATE INDEX "Product_published_createdAt_idx" ON "Product"("published", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentLink_productId_agent_key" ON "AgentLink"("productId", "agent");

-- AddForeignKey
ALTER TABLE "AgentLink" ADD CONSTRAINT "AgentLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

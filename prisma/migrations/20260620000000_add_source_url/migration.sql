-- Add the optional original-marketplace source URL used by the
-- source-flow agents (BaseTao, ACBuy) on the public product page.
ALTER TABLE "Product" ADD COLUMN "sourceUrl" TEXT;

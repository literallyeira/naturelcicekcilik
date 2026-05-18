CREATE TABLE IF NOT EXISTS "page_views" (
    "id" SERIAL NOT NULL,
    "visitor_id" VARCHAR(64),
    "path" VARCHAR(500) NOT NULL,
    "product_id" INTEGER,
    "referrer" VARCHAR(500),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "page_views_created_at_idx" ON "page_views"("created_at");
CREATE INDEX IF NOT EXISTS "page_views_product_id_idx" ON "page_views"("product_id");
CREATE INDEX IF NOT EXISTS "page_views_visitor_id_idx" ON "page_views"("visitor_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'page_views_product_id_fkey'
    ) THEN
        ALTER TABLE "page_views"
        ADD CONSTRAINT "page_views_product_id_fkey"
        FOREIGN KEY ("product_id") REFERENCES "products"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

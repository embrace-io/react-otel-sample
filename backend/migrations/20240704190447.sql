-- Create "products" table
CREATE TABLE "public"."products" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" text NULL,
  "price" bigint NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_products_deleted_at" to table: "products"
CREATE INDEX "idx_products_deleted_at" ON "public"."products" ("deleted_at");

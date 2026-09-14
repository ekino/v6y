-- Per-account opt-out for the audit notification emails.
ALTER TABLE "accounts" ADD COLUMN "audit_report_emails_enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "accounts" ADD COLUMN "daily_digest_emails_enabled" BOOLEAN NOT NULL DEFAULT true;

-- Applications become owned by an account, which is who the audit emails go to.
-- Added nullable first so the existing rows can be backfilled before the column
-- is closed off.
ALTER TABLE "applications" ADD COLUMN "owner_id" INTEGER;

-- 1. The account that already lists the application among the ones it follows is
-- the closest thing to an owner the previous schema recorded.
UPDATE "applications" AS a
SET "owner_id" = (
    SELECT acc."_id"
    FROM "accounts" AS acc
    WHERE a."_id" = ANY (acc."applications")
    ORDER BY acc."_id"
    LIMIT 1
)
WHERE a."owner_id" IS NULL;

-- 2. Anything still unclaimed falls to an administrator, who can reassign it.
UPDATE "applications" AS a
SET "owner_id" = (
    SELECT acc."_id"
    FROM "accounts" AS acc
    WHERE acc."role" IN ('SUPERADMIN', 'ADMIN')
    ORDER BY (acc."role" = 'SUPERADMIN') DESC, acc."_id"
    LIMIT 1
)
WHERE a."owner_id" IS NULL;

-- 3. Last resort, any account at all, so no row is lost to the NOT NULL below.
UPDATE "applications" AS a
SET "owner_id" = (SELECT acc."_id" FROM "accounts" AS acc ORDER BY acc."_id" LIMIT 1)
WHERE a."owner_id" IS NULL;

-- Deliberately fails rather than deleting data if applications exist without a
-- single account to attach them to.
ALTER TABLE "applications" ALTER COLUMN "owner_id" SET NOT NULL;

ALTER TABLE "applications"
    ADD CONSTRAINT "applications_owner_id_fkey"
    FOREIGN KEY ("owner_id") REFERENCES "accounts"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "applications_owner_id_idx" ON "applications"("owner_id");

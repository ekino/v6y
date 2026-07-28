-- Add recurring audit scheduling fields to applications
ALTER TABLE "applications" ADD COLUMN "audit_frequency_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "applications" ADD COLUMN "audit_frequency_cron" TEXT;

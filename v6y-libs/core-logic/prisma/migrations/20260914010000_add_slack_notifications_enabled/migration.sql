-- AlterTable
ALTER TABLE "accounts" ADD COLUMN "slack_notifications_enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "applications" ADD COLUMN "slack_channel_notifications_enabled" BOOLEAN NOT NULL DEFAULT false;

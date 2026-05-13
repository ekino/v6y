-- CreateTable
CREATE TABLE "audit_runs" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "branch" TEXT,
    "run_status" TEXT NOT NULL DEFAULT 'pending',
    "analysis_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_runs_pkey" PRIMARY KEY ("_id")
);

-- Add column to audit_reports table
ALTER TABLE "audit_reports" ADD COLUMN "audit_run_id" INTEGER;

-- AddForeignKey
ALTER TABLE "audit_runs" ADD CONSTRAINT "audit_runs_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_audit_run_id_fkey" FOREIGN KEY ("audit_run_id") REFERENCES "audit_runs"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "audit_runs_app_id_idx" ON "audit_runs"("app_id");

-- CreateIndex
CREATE INDEX "audit_runs_triggered_at_idx" ON "audit_runs"("triggered_at");

-- CreateIndex
CREATE INDEX "audit_runs_run_status_idx" ON "audit_runs"("run_status");

-- CreateIndex
CREATE INDEX "audit_reports_audit_run_id_idx" ON "audit_reports"("audit_run_id");

-- CreateTable
CREATE TABLE "ai_summary_reports" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "model" TEXT,
    "tokens_used" INTEGER,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_summary_reports_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_summary_reports_app_id_key" ON "ai_summary_reports"("app_id");

-- AddForeignKey
ALTER TABLE "ai_summary_reports" ADD CONSTRAINT "ai_summary_reports_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

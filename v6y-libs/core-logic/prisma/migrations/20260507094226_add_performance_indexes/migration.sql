-- CreateIndex
CREATE INDEX "audit_reports_app_id_idx" ON "audit_reports"("app_id");

-- CreateIndex
CREATE INDEX "audit_reports_app_id_type_category_idx" ON "audit_reports"("app_id", "type", "category");

-- CreateIndex
CREATE INDEX "dependencies_app_id_idx" ON "dependencies"("app_id");

-- CreateIndex
CREATE INDEX "dependencies_app_id_name_idx" ON "dependencies"("app_id", "name");

-- CreateIndex
CREATE INDEX "evolutions_app_id_idx" ON "evolutions"("app_id");

-- CreateIndex
CREATE INDEX "keywords_app_id_idx" ON "keywords"("app_id");

-- CreateIndex
CREATE INDEX "keywords_label_idx" ON "keywords"("label");

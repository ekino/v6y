-- CreateTable
CREATE TABLE "accounts" (
    "_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "applications" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "applications" (
    "_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "contact_mail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repo" JSONB,
    "configuration" JSONB,
    "links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "audit_reports" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3),
    "date_end" TIMESTAMP(3),
    "type" TEXT,
    "category" TEXT,
    "sub_category" TEXT,
    "audit_status" TEXT,
    "score" DOUBLE PRECISION,
    "score_status" TEXT,
    "score_unit" TEXT,
    "extra_infos" TEXT,
    "audit_help" JSONB,
    "module" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_reports_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "dependencies" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "type" TEXT,
    "name" TEXT,
    "version" TEXT,
    "recommended_version" TEXT,
    "status" TEXT,
    "status_help" JSONB,
    "module" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dependencies_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "deprecated_dependencies" (
    "_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deprecated_dependencies_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "evolutions" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "evolution_help" JSONB,
    "module" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evolutions_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "audit_helps" (
    "_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "explanation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_helps_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "evolution_helps" (
    "_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evolution_helps_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "dependency_status_helps" (
    "_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dependency_status_helps_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "module" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "applications_name_key" ON "applications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "applications_acronym_key" ON "applications"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "deprecated_dependencies_name_key" ON "deprecated_dependencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "audit_helps_category_key" ON "audit_helps"("category");

-- CreateIndex
CREATE UNIQUE INDEX "evolution_helps_category_key" ON "evolution_helps"("category");

-- CreateIndex
CREATE UNIQUE INDEX "dependency_status_helps_category_key" ON "dependency_status_helps"("category");

-- CreateIndex
CREATE UNIQUE INDEX "faqs_title_key" ON "faqs"("title");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_title_key" ON "notifications"("title");

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evolutions" ADD CONSTRAINT "evolutions_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keywords" ADD CONSTRAINT "keywords_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enforce at most one active (pending or in_progress) audit run per (app_id, branch).
-- This is a partial unique index that Prisma cannot express declaratively, so it is
-- managed here as a raw migration.
--
-- When createAuditRun races between the findFirst check and the INSERT, the database
-- rejects the second INSERT with a unique-constraint violation (Prisma error P2002).
-- The provider catches P2002 and re-fetches the winning run instead of creating a duplicate.
--
-- COALESCE(branch, '') is used because NULL != NULL in SQL — two NULLs would not
-- collide without the coercion.
CREATE UNIQUE INDEX IF NOT EXISTS audit_runs_active_unique
    ON audit_runs (app_id, COALESCE(branch, ''))
    WHERE run_status IN ('pending', 'in_progress');

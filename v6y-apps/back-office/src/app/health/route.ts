/**
 * Liveness endpoint targeted by the container healthchecks
 * (wget -q --spider http://localhost:PORT/health).
 */
export const dynamic = 'force-dynamic';

export function GET() {
    return Response.json({ status: 'ok' });
}

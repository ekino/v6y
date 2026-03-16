import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

interface GreenHostingExtraInfos {
    url: string;
    hostname: string;
    green: boolean;
    hostedBy: string;
    hostedByWebsite: string | null;
}

interface EcoindexExtraInfos {
    grade: string;
    score: number;
    water: number;
    ghg: number;
    dom: number;
    requests: number;
    size: number;
}

interface EcologicalImpactExtraInfos {
    file: string;
    line: number;
    column: number;
    message: string;
}

const parseExtraInfos = <T,>(extraInfos?: string): T | null => {
    if (!extraInfos) return null;
    try {
        return JSON.parse(extraInfos) as T;
    } catch {
        return null;
    }
};

// ─── Grade colours (A→G) ────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
    A: 'bg-emerald-500 text-white',
    B: 'bg-green-400 text-white',
    C: 'bg-yellow-400 text-gray-900',
    D: 'bg-orange-400 text-white',
    E: 'bg-orange-500 text-white',
    F: 'bg-red-500 text-white',
    G: 'bg-red-700 text-white',
};

const GRADE_BG: Record<string, string> = {
    A: 'from-emerald-50 to-green-50 border-emerald-200',
    B: 'from-green-50 to-teal-50 border-green-200',
    C: 'from-yellow-50 to-amber-50 border-yellow-200',
    D: 'from-orange-50 to-amber-50 border-orange-200',
    E: 'from-orange-50 to-red-50 border-orange-300',
    F: 'from-red-50 to-rose-50 border-red-300',
    G: 'from-red-100 to-rose-100 border-red-400',
};

// ─── Hosting card ────────────────────────────────────────────────────────────
const GreenHostingCard = ({ report }: { report: AuditType }) => {
    const { translate } = useTranslationProvider();
    const infos = parseExtraInfos<GreenHostingExtraInfos>(report.extraInfos);
    if (!infos) return null;

    const { green, hostname, hostedBy, hostedByWebsite } = infos;

    return (
        <Card
            className={`border shadow-sm transition-all hover:shadow-md ${
                green
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
            }`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-2xl"
                            role="img"
                            aria-label={green ? 'green leaf' : 'red cross'}
                        >
                            {green ? '🌿' : '⚠️'}
                        </span>
                        <CardTitle className="text-base font-bold text-gray-900">
                            {hostname}
                        </CardTitle>
                    </div>
                    <Badge
                        className={
                            green
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                        }
                    >
                        {green
                            ? translate(
                                  'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.greenBadge',
                              )
                            : translate(
                                  'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.nonGreenBadge',
                              )}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold text-gray-600 min-w-[90px]">
                        {translate(
                            'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.providerLabel',
                        )}
                    </span>
                    {hostedByWebsite ? (
                        <a
                            href={hostedByWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            {hostedBy}
                        </a>
                    ) : (
                        <span className="font-medium">{hostedBy || 'Unknown'}</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    {green
                        ? translate(
                              'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.greenDescription',
                          )
                        : translate(
                              'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.nonGreenDescription',
                          )}
                </p>
            </CardContent>
        </Card>
    );
};

// ─── Ecoindex card ───────────────────────────────────────────────────────────
const EcoindexCard = ({ report }: { report: AuditType }) => {
    const { translate } = useTranslationProvider();
    const infos = parseExtraInfos<EcoindexExtraInfos>(report.extraInfos);
    if (!infos) return null;

    const { grade, water, ghg, dom, requests, size } = infos;
    const score = report.score ?? 0;
    const gradeColor = GRADE_COLORS[grade] ?? 'bg-slate-400 text-white';
    const cardBg = GRADE_BG[grade] ?? 'from-slate-50 to-gray-50 border-slate-200';
    const device = report.subCategory ?? 'desktop';

    const metrics = [
        { label: 'DOM nodes', value: dom, icon: '🔤' },
        { label: 'Requests', value: requests, icon: '🌐' },
        { label: 'Page size', value: `${size} Kb`, icon: '⚖️' },
    ];

    return (
        <Card
            className={`border bg-gradient-to-br ${cardBg} shadow-sm transition-all hover:shadow-md`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label="leaf">
                            🌱
                        </span>
                        <CardTitle className="text-base font-bold text-gray-900">
                            {translate(
                                'vitality.appDetailsPage.auditReports.greenIndex.ecoindex.cardTitle',
                            )}
                        </CardTitle>
                        <Badge className="bg-slate-100 text-slate-700 text-xs capitalize">
                            {device}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Grade circle */}
                        <span
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-black shadow-sm ${gradeColor}`}
                        >
                            {grade}
                        </span>
                        {/* Numeric score */}
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-900 leading-none">
                                {score.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">/ 100</div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Environmental impact */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 rounded-lg p-3 border border-white/40 text-center">
                        <div className="text-xs text-gray-500 mb-1 font-medium">💧 Water</div>
                        <div className="text-lg font-bold text-blue-700">
                            {water?.toFixed(2)} <span className="text-xs font-normal">cl/view</span>
                        </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-white/40 text-center">
                        <div className="text-xs text-gray-500 mb-1 font-medium">☁️ GHG</div>
                        <div className="text-lg font-bold text-gray-700">
                            {ghg?.toFixed(2)}{' '}
                            <span className="text-xs font-normal">gCO₂e/view</span>
                        </div>
                    </div>
                </div>
                {/* Input metrics */}
                <div className="grid grid-cols-3 gap-2">
                    {metrics.map(({ label, value, icon }) => (
                        <div
                            key={label}
                            className="bg-white/50 rounded-md p-2 text-center border border-white/30"
                        >
                            <div className="text-base">{icon}</div>
                            <div className="text-sm font-bold text-gray-800">{value}</div>
                            <div className="text-xs text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>
                {/* Score bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>0 (worst)</span>
                        <span>100 (best)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${
                                grade <= 'B'
                                    ? 'bg-emerald-500'
                                    : grade <= 'D'
                                      ? 'bg-yellow-400'
                                      : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// ─── Ecological impact (creedengo) table ─────────────────────────────────────
const EcologicalImpactSection = ({ reports }: { reports: AuditType[] }) => {
    const { translate } = useTranslationProvider();
    if (!reports.length) return null;

    const grouped = reports.reduce(
        (acc, report) => {
            const rule = report.category ?? 'Unknown';
            if (!acc[rule]) acc[rule] = [];
            acc[rule].push(report);
            return acc;
        },
        {} as Record<string, AuditType[]>,
    );

    const getStatusClass = (status?: string | null) => {
        switch (status?.toLowerCase()) {
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <Card className="border border-amber-200 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    <CardTitle className="text-base font-bold text-gray-900">
                        {translate(
                            'vitality.appDetailsPage.auditReports.greenIndex.ecologicalImpact.cardTitle',
                        )}
                    </CardTitle>
                    <Badge className="bg-amber-100 text-amber-800">
                        {reports.length} issue{reports.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {translate(
                        'vitality.appDetailsPage.auditReports.greenIndex.ecologicalImpact.cardSubtitle',
                    )}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(grouped).map(([rule, ruleReports]) => (
                    <div key={rule} className="border rounded-lg overflow-hidden">
                        <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-amber-900">{rule}</span>
                            <Badge className="bg-amber-100 text-amber-800 text-xs">
                                {ruleReports.length} occurrence{ruleReports.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">
                                            File
                                        </th>
                                        <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">
                                            Line
                                        </th>
                                        <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">
                                            Col
                                        </th>
                                        <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">
                                            Severity
                                        </th>
                                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 hidden md:table-cell">
                                            Message
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ruleReports.map((report, idx) => {
                                        const infos = parseExtraInfos<EcologicalImpactExtraInfos>(
                                            report.extraInfos,
                                        );
                                        return (
                                            <tr
                                                key={report._id ?? idx}
                                                className={
                                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                                }
                                            >
                                                <td
                                                    className="px-4 py-2 font-mono text-xs text-gray-700 max-w-[200px] truncate"
                                                    title={infos?.file}
                                                >
                                                    {infos?.file ?? '-'}
                                                </td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600">
                                                    {infos?.line ?? '-'}
                                                </td>
                                                <td className="px-3 py-2 text-center text-xs text-gray-600">
                                                    {infos?.column ?? '-'}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <Badge
                                                        className={getStatusClass(
                                                            report.scoreStatus,
                                                        )}
                                                    >
                                                        {report.scoreStatus ?? '-'}
                                                    </Badge>
                                                </td>
                                                <td
                                                    className="px-4 py-2 text-xs text-gray-600 hidden md:table-cell max-w-[300px] truncate"
                                                    title={infos?.message}
                                                >
                                                    {infos?.message ?? '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
interface VitalityGreenIndexSectionProps {
    reports: AuditType[];
}

const VitalityGreenIndexSection = ({ reports }: VitalityGreenIndexSectionProps) => {
    const { translate } = useTranslationProvider();

    const hostingReports = reports.filter((r) => r.type === 'Green-Hosting');
    const ecoindexReports = reports.filter((r) => r.type === 'Ecoindex');
    const ecologicalImpactReports = reports.filter((r) => r.type === 'Ecological-Impact');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-gray-900">
                    {translate('vitality.appDetailsPage.auditReports.categories.greenIndex')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {translate('vitality.appDetailsPage.auditReports.descriptions.greenIndex')}
                </p>
            </div>

            {/* ── 1. Green Hosting ── */}
            {hostingReports.length > 0 && (
                <section>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span>🌍</span>{' '}
                        {translate(
                            'vitality.appDetailsPage.auditReports.greenIndex.hostingProvider.sectionTitle',
                        )}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hostingReports.map((report) => (
                            <GreenHostingCard key={report._id} report={report} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── 2. Ecoindex ── */}
            {ecoindexReports.length > 0 && (
                <section>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span>🌱</span>{' '}
                        {translate(
                            'vitality.appDetailsPage.auditReports.greenIndex.ecoindex.sectionTitle',
                        )}
                        <span className="text-xs font-normal text-gray-400 normal-case tracking-normal">
                            {translate(
                                'vitality.appDetailsPage.auditReports.greenIndex.ecoindex.sectionSubtitle',
                            )}
                        </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ecoindexReports.map((report) => (
                            <EcoindexCard key={report._id} report={report} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── 3. Ecological code impact (creedengo) ── */}
            {ecologicalImpactReports.length > 0 && (
                <section>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span>🔍</span>{' '}
                        {translate(
                            'vitality.appDetailsPage.auditReports.greenIndex.ecologicalImpact.sectionTitle',
                        )}
                    </h4>
                    <EcologicalImpactSection reports={ecologicalImpactReports} />
                </section>
            )}

            {/* Empty state when all three sections are empty */}
            {hostingReports.length === 0 &&
                ecoindexReports.length === 0 &&
                ecologicalImpactReports.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-3">🌿</div>
                        <p className="text-sm font-medium">
                            {translate('vitality.appDetailsPage.emptyStates.greenIndex.title')}
                        </p>
                        <p className="text-xs mt-1">
                            {translate(
                                'vitality.appDetailsPage.emptyStates.greenIndex.description',
                            )}
                        </p>
                    </div>
                )}
        </div>
    );
};

export default VitalityGreenIndexSection;

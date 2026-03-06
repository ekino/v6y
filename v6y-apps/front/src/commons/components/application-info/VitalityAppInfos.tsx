import Link from 'next/link';

import { AuditType } from '@v6y/core-logic/src/types';
import {
    Badge,
    Button,
    CheckCircledIcon,
    ChevronRightIcon,
    CommitIcon,
    CrossCircledIcon,
    ExclamationTriangleIcon,
    GlobeIcon,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import GetApplicationDetailsAuditReportsByParams from '../../../features/app-details/api/getApplicationDetailsAuditReportsByParams';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityApiConfig from '../../config/VitalityApiConfig';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { VitalityAppInfosProps } from '../../types/VitalityAppInfosProps';

const VitalityAppInfos = ({ app, source, canOpenDetails = true }: VitalityAppInfosProps) => {
    const { createUrlQueryParam, router } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const queryParams = createUrlQueryParam('_id', `${app._id}`);
    const appDetailsLink = source
        ? VitalityNavigationPaths.APP_DETAILS + '?' + queryParams + '&' + 'source=' + source
        : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

    const appLinks = app.links;
    const appRepository = app.repo;
    const appOpenedBranches = app.repo?.allBranches?.length || 0;

    // Fetch audit reports for metrics
    const { data: auditData } = useClientQuery<{
        getApplicationDetailsAuditReportsByParams: AuditType[];
    }>({
        queryCacheKey: ['getApplicationDetailsAuditReportsByParams', `${app._id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsAuditReportsByParams,
                variables: {
                    _id: app._id as number,
                },
            }),
    });

    const isSecuritySmell = (report: AuditType): boolean => {
        const categoryLower = report.category?.toLowerCase() || '';
        return (
            categoryLower.startsWith('commons-') ||
            categoryLower.startsWith('react-') ||
            categoryLower.startsWith('angular-') ||
            report.type === 'Code-Security'
        );
    };

    const calculateMetrics = (reports: AuditType[]) => {
        const metrics = {
            security: 0,
            maintainability: 0,
            accessibility: 0,
        };

        reports.forEach((report) => {
            if (isSecuritySmell(report)) {
                metrics.security++;
            } else if (
                report.type === 'Code-Complexity' ||
                report.type === 'Code-Coupling' ||
                report.category?.toLowerCase().includes('maintainability') ||
                report.category?.toLowerCase().includes('modularity') ||
                report.category?.toLowerCase().includes('coupling')
            ) {
                metrics.maintainability++;
            } else if (
                report.category?.toLowerCase().includes('accessibility') ||
                report.type?.toLowerCase().includes('accessibility')
            ) {
                metrics.accessibility++;
            }
        });

        return metrics;
    };

    const auditReports = auditData?.getApplicationDetailsAuditReportsByParams || [];
    const metrics = calculateMetrics(auditReports);

    const hasIssues = metrics.security > 0 || metrics.maintainability > 0;
    const isCritical = metrics.security > 5;

    const healthBadge = isCritical
        ? {
              label: 'CRITICAL',
              cls: 'bg-red-50 text-red-600 border-red-200',
              icon: <CrossCircledIcon className="w-3 h-3" />,
          }
        : hasIssues
          ? {
                label: 'WARNING',
                cls: 'bg-orange-50 text-orange-600 border-orange-200',
                icon: <ExclamationTriangleIcon className="w-3 h-3" />,
            }
          : {
                label: 'HEALTHY',
                cls: 'bg-green-50 text-green-600 border-green-200',
                icon: <CheckCircledIcon className="w-3 h-3" />,
            };

    const allLinks = [
        ...(appLinks || []).filter((link) => typeof link.value === 'string'),
        ...(app.contactMail
            ? [
                  {
                      label: translate('vitality.appListPage.contactEmail'),
                      value: `mailto:${app.contactMail}`,
                  },
              ]
            : []),
    ];

    return (
        <li
            data-testid="app-card"
            className="w-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
            onClick={() => canOpenDetails && router.push(appDetailsLink)}
            role={canOpenDetails ? 'button' : undefined}
        >
            <div className="p-5 flex flex-col gap-4">
                {/* Row 1: name + health + actions */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <h4
                            data-testid="app-name"
                            className="text-base font-bold text-slate-900 truncate leading-tight"
                        >
                            {app.name}
                        </h4>
                        <span
                            className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${healthBadge.cls}`}
                        >
                            {healthBadge.icon}
                            {healthBadge.label}
                        </span>
                    </div>

                    <div
                        className="flex items-center gap-1.5 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {appRepository?.gitUrl && (
                            <Link
                                href={appRepository.gitUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    className="w-8 h-8 p-0 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                                >
                                    <CommitIcon className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        )}
                        {appRepository?.webUrl && (
                            <Link
                                href={appRepository.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    className="w-8 h-8 p-0 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                                >
                                    <GlobeIcon className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        )}
                        {canOpenDetails && (
                            <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors ml-1" />
                        )}
                    </div>
                </div>

                {/* Row 2: badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={appOpenedBranches >= 5 ? 'warning' : 'default'}
                        className="text-xs"
                    >
                        Branches ({appOpenedBranches})
                    </Badge>
                    {metrics.security > 0 && (
                        <Badge variant="error" className="text-xs">
                            {metrics.security} security
                        </Badge>
                    )}
                    {metrics.maintainability > 0 && (
                        <Badge variant="warning" className="text-xs">
                            {metrics.maintainability} maintainability
                        </Badge>
                    )}
                    {metrics.accessibility > 0 && (
                        <Badge className="text-xs">{metrics.accessibility} accessibility</Badge>
                    )}
                </div>

                {/* Row 3: links */}
                {allLinks.length > 0 && (
                    <div
                        className="pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {allLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.value as string}
                                target={
                                    link.value?.toString().startsWith('mailto:')
                                        ? undefined
                                        : '_blank'
                                }
                                rel="noopener noreferrer"
                                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
};

export default VitalityAppInfos;

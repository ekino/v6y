import Link from 'next/link';

import { AuditType } from '@v6y/core-logic/src/types';
import {
    Badge,
    Button,
    CommitIcon,
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
    const { createUrlQueryParam } = useNavigationAdapter();
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

    return (
        <li className="w-full bg-white shadow-md rounded-lg border border-slate-100 flex flex-col overflow-hidden">
            {/* Hero Banner */}
            <div className={`w-full h-16 bg-slate-300 flex-shrink-0`} />

            {/* Content */}
            <div className="flex flex-col space-y-4 p-8 flex-grow">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-xl font-bold flex items-center gap-x-4">
                                <span data-testid="app-name">{app.name}</span>
                            </h4>
                        </div>

                        <div className="flex items-center gap-x-2">
                            {appRepository?.gitUrl && (
                                <Link href={appRepository.gitUrl}>
                                    <Button
                                        variant="outline"
                                        className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center"
                                    >
                                        <CommitIcon />
                                    </Button>
                                </Link>
                            )}
                            {appRepository?.webUrl && (
                                <Link href={appRepository.webUrl}>
                                    <Button
                                        variant="outline"
                                        className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center"
                                    >
                                        <GlobeIcon />
                                    </Button>
                                </Link>
                            )}
                            {canOpenDetails && (
                                <Link href={appDetailsLink}>
                                    <Button className="bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-2 rounded-md text-sm">
                                        {translate('vitality.appListPage.seeReporting') ||
                                            'See Reporting'}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Metrics and branches beneath title */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge
                            variant={appOpenedBranches >= 4 ? 'warning' : 'default'}
                            className="text-xs"
                        >
                            Branches ({appOpenedBranches})
                        </Badge>
                        {metrics.security > 0 && (
                            <Badge className="text-xs" variant="error">
                                <span className="font-semibold">{metrics.security}</span>
                                <span className="ml-1">security</span>
                            </Badge>
                        )}
                        {metrics.maintainability > 0 && (
                            <Badge className="text-xs" variant="warning">
                                <span className="font-semibold">{metrics.maintainability}</span>
                                <span className="ml-1">maintainability</span>
                            </Badge>
                        )}
                        {metrics.accessibility > 0 && (
                            <Badge className="text-xs">
                                <span className="font-semibold">{metrics.accessibility}</span>
                                <span className="ml-1">accessibility</span>
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex-grow" />

                <div className="flex flex-wrap gap-3">
                    {(appLinks || [])
                        .filter((link) => typeof link.value === 'string')
                        .map((link, id: number) => (
                            <Link
                                className="text-black text-xs"
                                key={id}
                                href={link.value as string}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </Link>
                        ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                    {app.contactMail && (
                        <Link
                            href={`mailto:${app.contactMail}`}
                            className="text-sm text-slate-700 no-underline hover:no-underline"
                        >
                            {translate('vitality.appListPage.contactEmail')}
                        </Link>
                    )}
                </div>
            </div>
        </li>
    );
};

export default VitalityAppInfos;

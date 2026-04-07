import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

interface VitalitySonarQubeViewProps {
    sonarqubeUrl: string;
}

const extractProjectKey = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return (
            urlObj.searchParams.get('id') ||
            urlObj.searchParams.get('project') ||
            urlObj.searchParams.get('projectKey') ||
            null
        );
    } catch {
        return null;
    }
};

const buildSonarLinks = (url: string) => {
    try {
        const source = new URL(url);
        const projectKey =
            source.searchParams.get('id') ||
            source.searchParams.get('project') ||
            source.searchParams.get('projectKey') ||
            '';

        if (!projectKey) {
            return {
                overview: source.toString(),
                issues: source.toString(),
                hotspots: source.toString(),
                measures: source.toString(),
            };
        }

        // Detect if it's SonarCloud or SonarQube Server
        const isSonarCloud = source.hostname.includes('sonarcloud.io');

        const buildUrl = (pathname: string, extraParams?: Record<string, string>) => {
            const target = new URL(source.origin);
            target.pathname = pathname;
            target.searchParams.set('id', projectKey);
            if (extraParams) {
                Object.entries(extraParams).forEach(([key, value]) => {
                    target.searchParams.set(key, value);
                });
            }
            return target.toString();
        };

        return {
            overview: buildUrl(isSonarCloud ? '/project/overview' : '/dashboard'),
            issues: buildUrl('/project/issues'),
            hotspots: buildUrl('/security_hotspots'),
            measures: buildUrl('/component_measures', {
                metricKeys: 'bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density',
            }),
        };
    } catch {
        return {
            overview: url,
            issues: url,
            hotspots: url,
            measures: url,
        };
    }
};

const VitalitySonarQubeView = ({ sonarqubeUrl }: VitalitySonarQubeViewProps) => {
    const { translate } = useTranslationProvider();

    const links = React.useMemo(() => buildSonarLinks(sonarqubeUrl), [sonarqubeUrl]);
    const projectKey = React.useMemo(() => extractProjectKey(sonarqubeUrl), [sonarqubeUrl]);

    const metricConfigs = [
        {
            key: 'overview',
            icon: '📊',
            color: 'bg-blue-50 border-blue-300 hover:bg-blue-100',
            badgeColor: 'bg-blue-500',
            label: translate('vitality.appDetailsPage.sonarqube.actions.overview'),
            description: translate('vitality.appDetailsPage.sonarqube.metrics.overviewDesc'),
            link: links.overview,
        },
        {
            key: 'issues',
            icon: '🐛',
            color: 'bg-red-50 border-red-300 hover:bg-red-100',
            badgeColor: 'bg-red-500',
            label: translate('vitality.appDetailsPage.sonarqube.actions.issues'),
            description: translate('vitality.appDetailsPage.sonarqube.metrics.issuesDesc'),
            link: links.issues,
        },
        {
            key: 'hotspots',
            icon: '🔒',
            color: 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100',
            badgeColor: 'bg-yellow-500',
            label: translate('vitality.appDetailsPage.sonarqube.actions.hotspots'),
            description: translate('vitality.appDetailsPage.sonarqube.metrics.hotspotsDesc'),
            link: links.hotspots,
        },
        {
            key: 'measures',
            icon: '📈',
            color: 'bg-green-50 border-green-300 hover:bg-green-100',
            badgeColor: 'bg-green-500',
            label: translate('vitality.appDetailsPage.sonarqube.actions.measures'),
            description: translate('vitality.appDetailsPage.sonarqube.metrics.measuresDesc'),
            link: links.measures,
        },
    ];

    return (
        <Card className="border-slate-200 shadow-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl text-gray-900">
                            {translate('vitality.appDetailsPage.sonarqube.title')}
                        </CardTitle>
                        {projectKey && (
                            <p className="text-sm text-slate-500 mt-2">
                                <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs font-semibold">
                                    {projectKey}
                                </span>
                            </p>
                        )}
                    </div>
                    <span className="text-4xl">🔍</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-slate-600">
                    {translate('vitality.appDetailsPage.sonarqube.description')}
                </p>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metricConfigs.map((config) => (
                        <a
                            key={config.key}
                            href={config.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline"
                        >
                            <div
                                className={`relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer ${config.color}`}
                            >
                                {/* Background icon */}
                                <div className="absolute top-2 right-2 text-4xl opacity-20">
                                    {config.icon}
                                </div>

                                {/* Badge */}
                                <div
                                    className="absolute top-0 left-0 w-1 h-full"
                                    style={{
                                        backgroundColor: config.badgeColor.replace('bg-', ''),
                                    }}
                                ></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-start gap-2 mb-2">
                                        <h3 className="font-semibold text-slate-900 text-sm leading-tight pt-1">
                                            {config.label}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {config.description}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-slate-300">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs h-6 px-2 text-slate-700 hover:text-slate-900"
                                        >
                                            {translate(
                                                'vitality.appDetailsPage.sonarqube.openReport',
                                            )}{' '}
                                            →
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Project URL Info */}
                <div className="rounded-lg border-2 border-slate-300 bg-gradient-to-r from-slate-50 to-slate-100 p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                        🔗 {translate('vitality.appDetailsPage.sonarqube.projectUrlLabel')}
                    </p>
                    <a
                        href={sonarqubeUrl}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all font-mono"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {sonarqubeUrl}
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default VitalitySonarQubeView;

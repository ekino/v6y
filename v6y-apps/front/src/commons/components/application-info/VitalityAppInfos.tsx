import Link from 'next/link';

import {
    Badge,
    Button,
    CommitIcon,
    GlobeIcon,
    StarIcon,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

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
    const trackedLinks = (appLinks || []).filter((link) => typeof link.value === 'string').length;

    return (
        <li className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition-colors hover:border-slate-300">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700" aria-hidden>
                                <StarIcon className="scale-125" />
                            </span>
                            <div className="min-w-0">
                                <h4 className="truncate text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
                                    <span data-testid="app-name">{app.name}</span>
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Repository health snapshot with direct access to reporting and tracked links.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant={appOpenedBranches >= 4 ? 'warning' : 'default'} className="rounded-full px-3 py-1 text-xs">
                                {appOpenedBranches} {appOpenedBranches === 1 ? 'branch' : 'branches'} tracked
                            </Badge>
                            <Badge variant="outline" className="rounded-full border-slate-300 bg-white px-3 py-1 text-xs text-slate-700">
                                {trackedLinks} {trackedLinks === 1 ? 'linked system' : 'linked systems'}
                            </Badge>
                            {app.contactMail && (
                                <Badge variant="outline" className="rounded-full border-slate-300 bg-white px-3 py-1 text-xs text-slate-700">
                                    Contact ready
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {appRepository?.gitUrl && (
                            <Link href={appRepository.gitUrl}>
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                >
                                    <CommitIcon className="scale-300" />
                                </Button>
                            </Link>
                        )}
                        {appRepository?.webUrl && (
                            <Link href={appRepository.webUrl}>
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                >
                                    <GlobeIcon className="scale-300" />
                                </Button>
                            </Link>
                        )}

                        {canOpenDetails && (
                            <Link href={appDetailsLink}>
                                <Button className="h-10 rounded-full bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800">
                                    {translate('vitality.appListPage.seeReporting') || 'See Reporting'}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {(appLinks || [])
                                .filter((link) => typeof link.value === 'string')
                                .map((link, id: number) => (
                                    <Link
                                        className="inline-flex max-w-full items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                                        key={id}
                                        href={link.value as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="truncate">{link.label}</span>
                                    </Link>
                                ))}
                        </div>
                    </div>

                    <div className="min-w-0 text-sm text-slate-600 md:text-right">
                        {app.contactMail && (
                            <Link
                                href={`mailto:${app.contactMail}`}
                                className="font-medium text-slate-700 no-underline hover:text-slate-950 hover:no-underline"
                            >
                                {translate('vitality.appListPage.contactEmail')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default VitalityAppInfos;

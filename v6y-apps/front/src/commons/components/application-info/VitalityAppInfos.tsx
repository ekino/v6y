import Link from 'next/link';

import {
    Badge,
    Button,
    CommitIcon,
    GlobeIcon,
    StarIcon,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { VitalityAppInfosProps } from '../../types/VitalityAppInfosProps';

const VitalityAppInfos = ({
    app,
    source,
    canOpenDetails = true,
    style,
}: VitalityAppInfosProps) => {
    const { translate } = useTranslationProvider();
    const appDetailsLink = source
        ? `${VitalityNavigationPaths.APP}/${app._id}?source=${source}`
        : `${VitalityNavigationPaths.APP}/${app._id}`;

    const appLinks = app.links;
    const appRepository = app.repo;
    const appOpenedBranches = app.repo?.allBranches?.length || 0;

    return (
        <li
            className="animate-fade-in-up group w-full bg-white space-y-6 p-6 rounded-lg border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
            style={style}
        >
            <div>
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex-1">
                        <h4 className="text-lg font-bold flex items-center gap-x-4">
                            <span
                                className="flex items-center transition-transform duration-300 group-hover:rotate-12 group-hover:text-amber-500"
                                aria-hidden
                            >
                                <StarIcon className="scale-125" />
                            </span>
                            <span data-testid="app-name">{app.name}</span>
                        </h4>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-x-2">
                        {appRepository?.gitUrl && (
                            <Link href={appRepository.gitUrl}>
                                <Button
                                    variant="outline"
                                    className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <CommitIcon className="scale-300" />
                                </Button>
                            </Link>
                        )}
                        {appRepository?.webUrl && (
                            <Link href={appRepository.webUrl}>
                                <Button
                                    variant="outline"
                                    className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <GlobeIcon className="scale-300" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                    <Badge
                        variant={appOpenedBranches >= 4 ? 'warning' : 'default'}
                        className="text-sm p-1"
                    >
                        Branches ({appOpenedBranches})
                    </Badge>
                </div>
                <div>
                    {canOpenDetails && (
                        <Link href={appDetailsLink}>
                            <Button className="bg-zinc-900 text-white hover:bg-indigo-600 px-6 py-2 rounded-md transition-all duration-200 hover:shadow-md hover:shadow-indigo-200">
                                {translate('vitality.appListPage.seeReporting') || 'See Reporting'}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {(appLinks || [])
                    .filter((link) => typeof link.value === 'string')
                    .map((link, id: number) => (
                        <Link
                            className="text-black text-xs transition-colors duration-200 hover:text-indigo-600"
                            key={id}
                            href={link.value as string}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label}
                        </Link>
                    ))}
            </div>

            <div>
                {app.contactMail && (
                    <Link
                        href={`mailto:${app.contactMail}`}
                        className="text-sm text-slate-700 no-underline hover:no-underline"
                    >
                        {translate('vitality.appListPage.contactEmail')}
                    </Link>
                )}
            </div>
        </li>
    );
};

export default VitalityAppInfos;

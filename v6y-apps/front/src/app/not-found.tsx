import Link from 'next/link';

import { CircleX } from '@v6y/ui-kit-front';

import VitalityNavigationPaths from '../commons/config/VitalityNavigationPaths';
import { getServerTranslations } from '../infrastructure/translation/serverTranslation';

export default async function NotFound() {
    const { badge, title, description, backToDashboard, openApplications } =
        await getServerTranslations({
            badge: 'vitality.notFound.badge',
            title: 'vitality.notFound.title',
            description: 'vitality.notFound.description',
            backToDashboard: 'vitality.notFound.backToDashboard',
            openApplications: 'vitality.notFound.openApplications',
        });

    return (
        <div className="mx-auto w-full max-w-3xl px-2 py-6 md:py-10">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-600">
                    <CircleX className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>

                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{badge}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                    {title}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                    {description}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href={VitalityNavigationPaths.DASHBOARD}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-gray-950 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        {backToDashboard}
                    </Link>
                    <Link
                        href={VitalityNavigationPaths.APP_LIST}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 bg-white px-5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-50"
                    >
                        {openApplications}
                    </Link>
                </div>
            </section>
        </div>
    );
}

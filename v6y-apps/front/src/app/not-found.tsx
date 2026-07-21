import Link from 'next/link';

import VitalityNavigationPaths from '../commons/config/VitalityNavigationPaths';
import { getServerTranslation } from '../infrastructure/translation/serverTranslation';

export default async function NotFound() {
    const badge = await getServerTranslation('vitality.notFound.badge');
    const title = await getServerTranslation('vitality.notFound.title');
    const description = await getServerTranslation('vitality.notFound.description');
    const backToDashboard = await getServerTranslation('vitality.notFound.backToDashboard');
    const openApplications = await getServerTranslation('vitality.notFound.openApplications');

    return (
        <div className="mx-auto w-full max-w-3xl px-2 py-6 md:py-10">
            <section className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f5f7fa_58%,#f8fafc_100%)] p-6 shadow-sm md:p-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-700">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M9.5 9.5l5 5m0-5l-5 5M12 21a9 9 0 100-18 9 9 0 000 18z"
                        />
                    </svg>
                </div>

                <p className="text-sm font-medium uppercase tracking-wide text-slate-600">{badge}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                    {title}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                    {description}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href={VitalityNavigationPaths.DASHBOARD}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        {backToDashboard}
                    </Link>
                    <Link
                        href={VitalityNavigationPaths.APP_LIST}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                    >
                        {openApplications}
                    </Link>
                </div>
            </section>
        </div>
    );
}

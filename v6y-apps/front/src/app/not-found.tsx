import Link from 'next/link';

import VitalityNavigationPaths from '../commons/config/VitalityNavigationPaths';

export default function NotFound() {
    return (
        <div className="mx-auto w-full max-w-3xl px-2 py-6 md:py-10">
            <section className="rounded-3xl border border-sky-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#edf6ff_58%,#f4fbff_100%)] p-6 shadow-sm md:p-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-white text-sky-700">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M9.5 9.5l5 5m0-5l-5 5M12 21a9 9 0 100-18 9 9 0 000 18z"
                        />
                    </svg>
                </div>

                <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Error 404</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                    This page could not be found
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                    The requested resource is unavailable or the link is outdated. Continue from the
                    dashboard or go back to the application list.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href={VitalityNavigationPaths.DASHBOARD}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-sky-700 px-5 text-sm font-medium text-white transition-colors hover:bg-sky-800"
                    >
                        Return to dashboard
                    </Link>
                    <Link
                        href={VitalityNavigationPaths.APP_LIST}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-sky-200 bg-white px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-sky-50"
                    >
                        Open applications list
                    </Link>
                </div>
            </section>
        </div>
    );
}

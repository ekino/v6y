'use client';

import { DynamicLoader } from '@v6y/ui-kit';

const VitalityAppList = DynamicLoader(() => import('./VitalityAppList'));

const VitalityAppListView = () => {
    return (
        <div className="mt-4">
            <section className="rounded-xl border border-slate-200 bg-linear-to-b from-slate-50/70 to-white p-3 md:p-4 shadow-sm">
                <VitalityAppList />
            </section>
        </div>
    );
};

export default VitalityAppListView;

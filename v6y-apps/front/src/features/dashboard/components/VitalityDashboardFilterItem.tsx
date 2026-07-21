import Link from 'next/link';

import { CardDescription } from '@v6y/ui-kit-front';

import { type DashboardItemType } from '../../../commons/config/VitalityCommonConfig';

interface VitalityDashboardFilterItemProps {
    option: DashboardItemType | null;
}

const VitalityDashboardFilterItem: React.FC<VitalityDashboardFilterItemProps> = ({ option }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url}>
            <div className="group rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-slate-300 hover:bg-slate-950 hover:text-white hover:shadow-md">
                <div className="flex items-start gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-sm transition-colors group-hover:border-white/15 group-hover:bg-white/5"
                        style={{
                            backgroundColor: `${option.avatarColor}12`,
                            color: option.avatarColor,
                        }}
                    >
                        {option.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold leading-tight text-slate-900 transition-colors group-hover:text-white">
                                {option.title}
                            </span>
                            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 transition-colors group-hover:text-slate-300">
                                Open
                            </span>
                        </div>
                        <CardDescription className="mt-1 text-xs leading-5 text-slate-500 transition-colors group-hover:text-slate-300">
                        {option.description}
                        </CardDescription>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VitalityDashboardFilterItem;

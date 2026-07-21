'use client';

import * as React from 'react';

export interface VitalitySummaryStatItem {
    key: string;
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    tone: 'neutral' | 'success' | 'warning' | 'error';
}

const TONE_ICON_CLASSNAME: Record<VitalitySummaryStatItem['tone'], string> = {
    neutral: 'text-slate-500',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
};

interface VitalitySummaryStatBarProps {
    items: VitalitySummaryStatItem[];
}

/**
 * Compact "at a glance" stat row shared by report summaries. Renders one bordered
 * strip with dividers instead of a grid of separate oversized colored cards.
 */
const VitalitySummaryStatBar = ({ items }: VitalitySummaryStatBarProps) => (
    <div className="mb-6 grid grid-cols-2 divide-x divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4 sm:divide-y-0">
        {items.map(({ key, label, value, icon: Icon, tone }) => (
            <div key={key} className="flex items-center gap-2.5 px-4 py-3">
                <Icon
                    className={`h-4 w-4 shrink-0 ${TONE_ICON_CLASSNAME[tone]}`}
                    aria-hidden="true"
                />
                <div className="min-w-0">
                    <div className="text-lg font-semibold leading-tight text-slate-900">
                        {value}
                    </div>
                    <div className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {label}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default VitalitySummaryStatBar;

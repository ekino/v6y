import Link from 'next/link';
import * as React from 'react';

import { FaqType } from '@v6y/core-logic/src/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@v6y/ui-kit-front';

const VitalityFaqList = ({ dataSource }: { dataSource?: FaqType[] }) => {
    if (!dataSource?.length) {
        return null;
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-3"
                defaultValue={dataSource[0]?.title || ''}
            >
                {dataSource
                    .filter((option: FaqType) => option.title?.length)
                    .map((option: FaqType, idx: number) => (
                        <AccordionItem
                            className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 shadow-sm"
                            key={option.title || idx}
                            value={option.title || String(idx)}
                        >
                            <AccordionTrigger>
                                <span className="pr-4 text-left text-base font-semibold text-slate-950">
                                    {option.title}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                        {option.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                                        {option.links?.map((link, linkIdx) => (
                                            <Link
                                                key={linkIdx}
                                                href={link.value ?? ''}
                                                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </div>
    );
};

export default VitalityFaqList;

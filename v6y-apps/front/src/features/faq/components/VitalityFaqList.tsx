import Link from 'next/link';
import * as React from 'react';

import { FaqType } from '@v6y/core-logic/src/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@v6y/ui-kit-front';

const VitalityFaqList = ({ dataSource }: { dataSource?: FaqType[] }) => {
    if (!dataSource?.length) {
        return null;
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white px-5 md:px-6">
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={dataSource[0]?.title || ''}
            >
                {dataSource
                    .filter((option: FaqType) => option.title?.length)
                    .map((option: FaqType, idx: number) => (
                        <AccordionItem
                            className="last:border-b-0"
                            key={option.title || idx}
                            value={option.title || String(idx)}
                        >
                            <AccordionTrigger className="text-left text-base font-semibold text-slate-950 hover:no-underline">
                                {option.title}
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                    {option.description}
                                </p>
                                {Boolean(option.links?.length) && (
                                    <div className="mt-4 flex flex-wrap gap-2">
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
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </div>
    );
};

export default VitalityFaqList;

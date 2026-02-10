import Link from 'next/link';
import * as React from 'react';

import { FaqType } from '@v6y/core-logic/src/types/FaqType';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@v6y/ui-kit-front/components/molecules/Accordion';

const VitalityFaqList = ({ dataSource }: { dataSource?: FaqType[] }) => {
    if (!dataSource?.length) {
        return null;
    }

    console.log();

    return (
        <div className="w-full">
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
                defaultValue={dataSource[0]?.title || ''}
            >
                {dataSource
                    .filter((option: FaqType) => option.title?.length)
                    .map((option: FaqType, idx: number) => (
                        <AccordionItem
                            className="px-10 py-6 border border-slate-200 rounded-md shadow-md"
                            key={option.title || idx}
                            value={option.title || String(idx)}
                        >
                            <AccordionTrigger>
                                <span className="font-bold text-[16px] text-slate-900">
                                    {option.title}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pt-2 pb-4">
                                    <p className="text-[14px] leading-[24px] text-black whitespace-pre-wrap">
                                        {option.description}
                                    </p>
                                    <div className="mt-2 flex justify-end">
                                        {option.links?.map((link, linkIdx) => (
                                            <Link
                                                key={linkIdx}
                                                href={link.value ?? ''}
                                                className="text-black"
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

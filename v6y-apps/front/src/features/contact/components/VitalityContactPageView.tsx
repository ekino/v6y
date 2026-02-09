'use client';

import { useTranslationProvider } from '@v6y/ui-kit-front';

import { ContactForm } from './VitalityContactPageForm';

export default function VitalityContactPageView() {
    const { translate } = useTranslationProvider();

    return (
        <div className="h-[90vh] flex flex-col justify-center items-center">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-balance">
                    {translate('vitality.contactPage.title')}
                </h2>
                <p className="text-lg text-muted-foreground text-balance">
                    {translate('vitality.contactPage.subtitle')}
                </p>
            </div>

            <div className="flex justify-center items-center">
                <ContactForm />
            </div>
        </div>
    );
}

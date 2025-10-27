'use client';

import { ContactForm } from './VitalityContactPageForm';
import {
  Card,
  EnvelopeClosedIcon,
  ChatBubbleIcon,
  useTranslationProvider,
} from '@v6y/ui-kit-front';

export default function VitalityContactPageView() {
  const { translate } = useTranslationProvider();

  return (
    <>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          {translate('vitality.contactPage.title')}
        </h2>
        <p className="text-xl text-muted-foreground text-balance">
          {translate('vitality.contactPage.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 md:gap-12">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 shadow hover:border-foreground/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-foreground text-background rounded-lg">
                <EnvelopeClosedIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{translate('vitality.contactPage.emailSupport.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {translate('vitality.contactPage.emailSupport.description')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow hover:border-foreground/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-foreground text-background rounded-lg">
                <ChatBubbleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{translate('vitality.contactPage.quickResponse.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {translate('vitality.contactPage.quickResponse.description')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </>
  );
}

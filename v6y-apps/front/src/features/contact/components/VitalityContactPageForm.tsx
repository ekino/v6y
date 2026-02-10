'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@v6y/ui-kit-front/components/atoms/button';
import { Input } from '@v6y/ui-kit-front/components/atoms/input';
import { Label } from '@v6y/ui-kit-front/components/atoms/label';
import { Textarea } from '@v6y/ui-kit-front/components/atoms/textarea';
import { Card } from '@v6y/ui-kit-front/components/molecules/Card';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';

export function ContactForm() {
    const { translate } = useTranslationProvider();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEmail('');
        setMessage('');
        setIsSubmitting(false);
    };

    return (
        <Card className="p-8 border-slate-200 shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                        {translate('vitality.contactPage.form.email.label')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={translate('vitality.contactPage.form.email.placeholder')}
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(event.target.value)
                        }
                        required
                        className="h-12 text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-medium">
                        {translate('vitality.contactPage.form.message.label')}
                    </Label>
                    <Textarea
                        id="message"
                        placeholder={translate('vitality.contactPage.form.message.placeholder')}
                        value={message}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setMessage(event.target.value)
                        }
                        required
                        className="min-h-[200px] text-base resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        {translate('vitality.contactPage.form.message.helper')}
                    </p>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-medium"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? translate('vitality.contactPage.form.submit.sending')
                        : translate('vitality.contactPage.form.submit.default')}
                </Button>
            </form>
        </Card>
    );
}

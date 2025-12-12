'use client';

import * as React from 'react';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Flow, Settings } from 'react-chatbotify';

import { LoaderView } from '@v6y/ui-kit';

import { VitalityBotFlow } from './VitalityBotFlow';
import VitalityBotSettings from './VitalityBotSettings';

const ChatBot = lazy(() => import('react-chatbotify'));

export default function VitalityBot() {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            {isLoaded && (
                <Suspense fallback={<LoaderView />}>
                    <ChatBot
                        flow={VitalityBotFlow as unknown as Flow}
                        themes={VitalityBotSettings.themes}
                        styles={VitalityBotSettings.styles}
                        settings={VitalityBotSettings.settings as unknown as Settings}
                    />
                </Suspense>
            )}
        </>
    );
}

'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { Settings } from 'react-chatbotify';

import VitalityLoader from '../VitalityLoader';
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
                <Suspense fallback={<VitalityLoader />}>
                    <ChatBot
                        flow={VitalityBotFlow}
                        themes={VitalityBotSettings.themes}
                        styles={VitalityBotSettings.styles}
                        settings={VitalityBotSettings.settings as unknown as Settings}
                    />
                </Suspense>
            )}
        </>
    );
}

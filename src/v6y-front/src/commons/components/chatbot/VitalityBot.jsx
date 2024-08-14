'use client';

import { Suspense, lazy, useEffect, useState } from 'react';

import VitalityLoader from '../VitalityLoader.jsx';
import VitalityBotSettings from './VitalityBotSettings.js';

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
                        themes={VitalityBotSettings.themes}
                        styles={VitalityBotSettings.styles}
                        settings={VitalityBotSettings.settings}
                    />
                </Suspense>
            )}
        </>
    );
}

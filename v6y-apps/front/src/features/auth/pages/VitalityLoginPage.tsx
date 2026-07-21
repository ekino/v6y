import * as React from 'react';

import VitalityLoginForm from '../components/VitalityLoginForm';

export default function VitalityLoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-7rem)] w-full items-start justify-center overflow-hidden py-2 md:min-h-[calc(100vh-8rem)] md:items-center md:py-4">
            <VitalityLoginForm />
        </div>
    );
}

'use client';

import VitalityLoginForm from '../components/VitalityLoginForm';

// Centering and no-scroll are handled once in VitalityPageLayout (it already
// keys off the /login route), so this page only renders the form.
export default function VitalityLoginPage() {
    return <VitalityLoginForm />;
}

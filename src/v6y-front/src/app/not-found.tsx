import Link from 'next/link';

import VitalityNavigationPaths from '../commons/config/VitalityNavigationPaths';

export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href={VitalityNavigationPaths.DASHBOARD}>Return to Dashboard</Link>
        </div>
    );
}

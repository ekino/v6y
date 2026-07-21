import VitalityProjectDetailsView from '../components/VitalityProjectDetailsView';

interface VitalityProjectDetailsPageProps {
    appId?: number;
}

export default function VitalityProjectDetailsPage({ appId }: VitalityProjectDetailsPageProps) {
    return <VitalityProjectDetailsView applicationId={appId} />;
}

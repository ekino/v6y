import VitalityAppDetailsView from '../components/VitalityAppDetailsView';

interface VitalityReportDetailsPageProps {
    appId?: number;
    reportId?: number;
}

export default function VitalityReportDetailsPage({
    appId,
    reportId,
}: VitalityReportDetailsPageProps) {
    return <VitalityAppDetailsView applicationId={appId} auditRunId={reportId} />;
}

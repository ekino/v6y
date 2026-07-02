import VitalityReportDetailsPage from '../../../../../features/app-details/pages/VitalityReportDetailsPage';

interface AppReportPageProps {
    params:
        | {
              appId: string;
              reportId: string;
          }
        | Promise<{
              appId: string;
              reportId: string;
          }>;
}

export default async function AppReportPage({ params }: AppReportPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const parsedAppId = Number.parseInt(resolvedParams.appId, 10);
    const parsedReportId = Number.parseInt(resolvedParams.reportId, 10);
    const appId = Number.isFinite(parsedAppId) ? parsedAppId : undefined;
    const reportId = Number.isFinite(parsedReportId) ? parsedReportId : undefined;

    return <VitalityReportDetailsPage appId={appId} reportId={reportId} />;
}

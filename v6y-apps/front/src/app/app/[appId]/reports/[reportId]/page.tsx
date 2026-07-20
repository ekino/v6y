import { parseNumericParam } from '../../../../../commons/utils/NumericParamUtils';
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
    const appId = parseNumericParam(resolvedParams.appId);
    const reportId = parseNumericParam(resolvedParams.reportId);

    return <VitalityReportDetailsPage appId={appId} reportId={reportId} />;
}

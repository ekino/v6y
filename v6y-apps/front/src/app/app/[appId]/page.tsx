import { parseNumericParam } from '../../../commons/utils/NumericParamUtils';
import VitalityProjectDetailsPage from '../../../features/app-details/pages/VitalityProjectDetailsPage';

interface AppProjectPageProps {
    params:
        | {
              appId: string;
          }
        | Promise<{
              appId: string;
          }>;
}

export default async function AppProjectPage({ params }: AppProjectPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const appId = parseNumericParam(resolvedParams.appId);

    return <VitalityProjectDetailsPage appId={appId} />;
}

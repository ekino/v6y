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
    const parsedAppId = Number.parseInt(resolvedParams.appId, 10);
    const appId = Number.isFinite(parsedAppId) ? parsedAppId : undefined;

    return <VitalityProjectDetailsPage appId={appId} />;
}

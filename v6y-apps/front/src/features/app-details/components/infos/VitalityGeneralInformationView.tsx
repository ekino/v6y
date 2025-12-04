import { ApplicationType, AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider, LoaderView } from '@v6y/ui-kit';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useNavigationAdapter,
  Skeleton
} from '@v6y/ui-kit-front';
import {
  buildClientQuery,
  useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';
import { getIndicatorColors } from '../../../../commons/utils/StatusUtils';
import { getGradeFromScore } from '../../../../commons/utils/ScoreUtils';

interface VitalityGeneralInformationViewProps {
  appInfos?: ApplicationType;
  isLoading?: boolean;
}

const VitalityGeneralInformationView = ({
  appInfos,
  isLoading = false,
}: VitalityGeneralInformationViewProps) => {
  const { translate } = useTranslationProvider();
  const { getUrlParams } = useNavigationAdapter();

  const [_id] = getUrlParams(['_id']);
  const { isLoading: isAppAuditReportsLoading, data: appAuditReports } =
    useClientQuery<{
      getApplicationDetailsAuditReportsByParams: AuditType[];
    }>({
      queryCacheKey: ['getApplicationDetailsAuditReportsByParams', `${_id}`],
      queryBuilder: async () =>
        buildClientQuery({
          queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
          query: GetApplicationDetailsAuditReportsByParams,
          variables: {
            _id: parseInt(_id as string, 10),
          },
        }),
    });

  const indicators = (appAuditReports?.getApplicationDetailsAuditReportsByParams || []).map(report => ({
    label: translate(`vitality.appDetailsPage.infos.indicators.${report.type}`),
    value: `${report.score}%`,
    grade: getGradeFromScore(report.score),
  }));

  return isLoading ? (
    <LoaderView />
  ) : (
    <Card className="border-slate-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">
          {translate('vitality.appDetailsPage.infos.title') ||
            'General Informations'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p
          data-testid="app-name"
          className="text-gray-700 leading-relaxed text-base"
        >
          {translate('vitality.appDetailsPage.infos.description').replace(
            '{appName}',
            appInfos?.name || 'Vitality'
          )}
        </p>

        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {translate('vitality.appDetailsPage.infos.productionUrl')}
            </span>{' '}
            <a
              href={appInfos?.links?.[0]?.value}
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {appInfos?.links?.[0]?.value}
            </a>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {translate('vitality.appDetailsPage.infos.repository')}
            </span>{' '}
            <a
              href={appInfos?.repo?.gitUrl || 'https://github.com/ekino/v6y'}
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {appInfos?.repo?.gitUrl || 'https://github.com/ekino/v6y'}
            </a>
            <div className="text-sm" data-testid="branches-count">
              {translate('vitality.appDetailsPage.infos.branches').replace(
                '{count}',
                (appInfos?.repo?.allBranches?.length ?? 0).toString()
              )}
            </div>
          </div>
        </div>

        {isAppAuditReportsLoading ? (
            <Skeleton className="h-12 w-full bg-gray-200" />
        ) : indicators.length > 0 ? (
          <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-6 items-start justify-between">
            {indicators.map((indicator) => {
              const { bgColor, textColor } = getIndicatorColors(indicator.grade);
              return (
                <div
                  key={indicator.label}
                  className="flex flex-col items-center justify-center overflow-hidden flex-shrink-0"
                >
                  <div className="flex items-center justify-center gap-2 h-7 px-1.5">
                    <p className="text-xl font-normal leading-7 text-black">
                      {indicator.value}
                    </p>
                    <div
                      className={`${bgColor} ${textColor} flex items-center justify-center h-5 px-2.5 py-2 rounded-md flex-shrink-0`}
                    >
                      <p className="text-sm font-medium leading-6">
                        {indicator.grade}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-black leading-5">
                    {indicator.label}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-700">⚠️ {translate('vitality.appDetailsPage.infos.noIndicators')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalityGeneralInformationView;

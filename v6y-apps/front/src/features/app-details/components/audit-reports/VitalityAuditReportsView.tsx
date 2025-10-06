import { AuditType } from '@v6y/core-logic/src/types';
import {
    DynamicLoader,
    FormOutlined,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { exportAppAuditReportsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

interface VitalityAuditReportsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsAuditReportsByParams: AuditType[] };
}

const VitalityAuditReportsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsAuditReportsLoading,
        data: appDetailsAuditReports,
    }: VitalityAuditReportsQueryType = useClientQuery<{ getApplicationDetailsAuditReportsByParams: AuditType[] }>({
        queryCacheKey: ['getApplicationDetailsAuditReportsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsAuditReportsByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const auditReports = appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams
        ?.filter(
            (auditReport) =>
                auditReport?.auditHelp?.category?.length && auditReport?.auditHelp?.title?.length,
        )
        ?.map((auditReport) => ({
            ...auditReport,
            ...auditReport?.module,
        }));

    const onExportClicked = () => {
        exportAppAuditReportsToCSV(auditReports || []);
    };

    const { translate } = useTranslationProvider();

    return (
        <VitalitySectionView
            isLoading={isAppDetailsAuditReportsLoading}
            isEmpty={!auditReports?.length}
            title={translate('vitality.appDetailsPage.audit.reportsTitle')}
            avatar={<FormOutlined />}
            exportButtonLabel={translate('vitality.appDetailsPage.audit.exportLabel')}
            onExportClicked={onExportClicked}
        >
            {auditReports && <VitalityAuditReportsTypeGrouper auditReports={auditReports} />}
        </VitalitySectionView>
    );
};

export default VitalityAuditReportsView;

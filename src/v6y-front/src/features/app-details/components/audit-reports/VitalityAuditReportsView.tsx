import { exportAppAuditReportsToCSV } from '@/commons/utils/VitalityDataExportUtils';
import { buildClientQuery, useClientQuery } from '@/infrastructure/adapters/api/useQueryAdapter';
import { FormOutlined } from '@ant-design/icons';
import { AuditType } from '@v6y/commons';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';



const VitalityAuditReportsTypeGrouper = VitalityDynamicLoader('./VitalityAuditReportsTypeGrouper')

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
    }: VitalityAuditReportsQueryType = useClientQuery({
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
            status: auditReport.status,
        }));

    const onExportClicked = () => {
        exportAppAuditReportsToCSV(auditReports || []);
    };

    return (
        <VitalitySectionView
            isLoading={isAppDetailsAuditReportsLoading}
            isEmpty={!auditReports?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE}
            avatar={<FormOutlined />}
            exportButtonLabel={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_EXPORT_LABEL}
            onExportClicked={onExportClicked}
        >
            {auditReports && <VitalityAuditReportsTypeGrouper auditReports={auditReports} />}
        </VitalitySectionView>
    );
};

export default VitalityAuditReportsView;

import { FormOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';
import { exportAppDetailsDataToCSV } from '../../../../commons/utils/VitalityDataExportUtils.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams.js';


const VitalityAuditReportsTypeGrouper = dynamic(
    () => import('./VitalityAuditReportsTypeGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityAuditReportsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsAuditReportsLoading, data: appDetailsAuditReports } =
        useClientQuery({
            queryCacheKey: ['getApplicationDetailsAuditReportsByParams', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetApplicationDetailsAuditReportsByParams,
                    queryParams: {
                        appId,
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
        exportAppDetailsDataToCSV({
            appDetails: {
                appId,
                auditReports,
            },
        });
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
            <VitalityAuditReportsTypeGrouper auditReports={auditReports} />
        </VitalitySectionView>
    );
};

export default VitalityAuditReportsView;

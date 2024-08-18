import { FormOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityEmptyView from '../../../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView.jsx';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView.jsx';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig.js';
import { AUDIT_REPORT_TYPES } from '../../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsAuditReports from '../../api/getAppDetailsAuditReports.js';
import VitalityCodeStatusReportsView from './auditors/VitalityCodeStatusReportsView.jsx';
import VitalityLighthouseReportsView from './auditors/VitalityLighthouseReportsView.jsx';

const VitalityAppDetailsAuditReportsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsAuditReportsLoading, data: appDetailsAuditReports } =
        useClientQuery({
            queryCacheKey: ['getAppDetailsAuditReportsByParams', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetAppDetailsAuditReports,
                    queryParams: {
                        appId,
                    },
                }),
        });

    if (isAppDetailsAuditReportsLoading) {
        return <VitalityLoader />;
    }

    const auditDetailsAuditReports = appDetailsAuditReports?.getAppDetailsAuditReportsByParams;
    if (!auditDetailsAuditReports?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalitySectionView
            title={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE}
            avatar={<FormOutlined />}
        >
            <VitalityTabGrouperView
                name="audit_reports_grouper_tab"
                ariaLabelledby="audit_reports_grouper_tab_content"
                align="center"
                criteria="type"
                hasAllGroup={false}
                dataSource={auditDetailsAuditReports}
                onRenderChildren={(group, data) => (
                    <div id="audit_reports_grouper_tab_content">
                        {group === AUDIT_REPORT_TYPES.lighthouse && (
                            <VitalityLighthouseReportsView reports={data} />
                        )}
                        {(group === AUDIT_REPORT_TYPES.codeCompliance ||
                            group === AUDIT_REPORT_TYPES.codeComplexity ||
                            group === AUDIT_REPORT_TYPES.codeCoupling ||
                            group === AUDIT_REPORT_TYPES.codeSecurity ||
                            group === AUDIT_REPORT_TYPES.codeDuplication) && (
                            <VitalityCodeStatusReportsView reports={data} />
                        )}
                    </div>
                )}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsAuditReportsView;

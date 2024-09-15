import { Descriptions, Tag, Typography } from 'antd';
import React from 'react';

import VitalityTerms from '../../../../../commons/config/VitalityTerms.js';

const VitalityMetricDetailsView = ({ metric }) => (
    <Descriptions bordered size="middle" column={1}>
        <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_TITLE}>
            <Typography.Title level={4}>{metric?.auditHelp?.title}</Typography.Title>
        </Descriptions.Item>

        <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_STATUS}>
            <Tag
                bordered
                color={metric.status?.toLowerCase() || '#0693e3'}
                style={{ backgroundColor: 'white' }}
            >
                {metric.status?.toLowerCase() ||
                    VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_STATUS_EMPTY}
            </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_DESCRIPTION}>
            <Typography.Text>
                {metric?.auditHelp?.description ||
                    VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_DESCRIPTION_EMPTY}
            </Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_EXPLANATION}>
            <Typography.Text>
                {metric?.auditHelp?.explanation ||
                    VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_EXPLANATION_EMPTY}
            </Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_SCORE}>
            <Typography.Text>{`${metric.score || 0}${metric.scoreUnit || ''}`}</Typography.Text>
        </Descriptions.Item>

        {metric?.module?.branch?.length && (
            <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_BRANCH}>
                <Typography.Text>{metric?.module?.branch}</Typography.Text>
            </Descriptions.Item>
        )}

        {metric?.module?.path?.length && (
            <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_METRIC_MODULE}>
                <Typography.Text>{metric?.module?.path}</Typography.Text>
            </Descriptions.Item>
        )}

        {metric.extraInfos?.length && (
            <Descriptions.Item label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_MORE_DETAILS}>
                <Typography.Text>{metric.extraInfos}</Typography.Text>
            </Descriptions.Item>
        )}
    </Descriptions>
);

export default VitalityMetricDetailsView;

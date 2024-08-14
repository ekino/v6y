import { ExportOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';

import VitalityTerms from '../../../commons/config/VitalityTerms.js';

const VitalityAppListHeader = ({ appsTotal, onExportApplicationsClicked }) => (
    <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ textAlign: 'left' }}>
            {appsTotal > 0 && (
                <Typography.Title level={3}>
                    {`${VitalityTerms.VITALITY_APP_LIST_TOTAL_LABEL} ${appsTotal}`}
                </Typography.Title>
            )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ textAlign: 'right' }}>
            <Button icon={<ExportOutlined />} onClick={onExportApplicationsClicked}>
                {VitalityTerms.VITALITY_APP_LIST_EXPORT_LABEL}
            </Button>
        </Col>
        <Col span={24} />
    </Row>
);

export default VitalityAppListHeader;

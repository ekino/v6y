import { Card, Collapse } from 'antd';

import VitalityEmptyView from './VitalityEmptyView.jsx';

const VitalityCollapse = ({ title, bordered, accordion, wrap, dataSource }) => {
    if (!wrap) {
        return (
            <>
                {dataSource?.length > 0 ? (
                    <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
                ) : (
                    <VitalityEmptyView />
                )}
            </>
        );
    }

    return (
        <Card title={title}>
            {dataSource?.length > 0 ? (
                <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
            ) : (
                <VitalityEmptyView />
            )}
        </Card>
    );
};

export default VitalityCollapse;

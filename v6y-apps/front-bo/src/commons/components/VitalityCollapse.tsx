import VitalityEmptyView from '@v6y/shared-ui/src/components/VitalityEmptyView/VitalityEmptyView';
import { Collapse } from 'antd';
import * as React from 'react';

const VitalityCollapse = ({ bordered, accordion, dataSource }) => {
    return (
        <>
            {dataSource?.length > 0 ? (
                <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
            ) : (
                <VitalityEmptyView />
            )}
        </>
    );
};

export default VitalityCollapse;

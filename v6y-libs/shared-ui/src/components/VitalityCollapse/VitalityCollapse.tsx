import { Collapse } from 'antd';
import * as React from 'react';

import { VitalityCollapseProps } from '../../types/VitalityCollapseProps.ts';
import VitalityEmptyView from '../VitalityEmptyView/VitalityEmptyView.tsx';

const VitalityCollapse = ({ bordered, accordion, dataSource }: VitalityCollapseProps) => {
    return (
        <>
            {(dataSource?.length || 0) > 0 ? (
                <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
            ) : (
                <VitalityEmptyView />
            )}
        </>
    );
};

export default VitalityCollapse;

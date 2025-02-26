import * as React from 'react';

import { Collapse } from '../../atoms';
import { CollapseProps } from '../../types';
import VitalityEmptyView from './VitalityEmptyView';

const VitalityCollapse = ({ bordered, accordion, dataSource }: CollapseProps) => {
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

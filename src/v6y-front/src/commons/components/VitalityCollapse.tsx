import { Collapse } from 'antd';

import { VitalityCollapseProps } from '../types/VitalityCollapseProps';
import VitalityEmptyView from './VitalityEmptyView';

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

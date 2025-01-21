import VitalityEmptyView from '@v6y/shared-ui/src/components/VitalityEmptyView/VitalityEmptyView';
import { Collapse } from 'antd';

import { VitalityCollapseProps } from '../types/VitalityCollapseProps';

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

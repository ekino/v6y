import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText';
import { List } from 'antd';
import * as React from 'react';

import { VitalityListProps } from '../types/VitalityListProps';

const VitalityPaginatedList = ({
    dataSource,
    pageSize = 10,
    bordered = true,
    grid,
    header,
    renderItem,
    showFooter = true,
    style,
}: VitalityListProps) => (
    <List
        bordered={bordered}
        itemLayout="vertical"
        dataSource={dataSource}
        grid={grid}
        pagination={{
            position: 'bottom',
            align: 'center',
            pageSize,
            hideOnSinglePage: true,
        }}
        renderItem={renderItem}
        header={header}
        footer={
            showFooter ? <VitalityText text={`Total: ${dataSource?.length || 0}`} strong /> : null
        }
        style={{
            ...(style || {}),
            marginBottom: '2rem',
        }}
    />
);

export default VitalityPaginatedList;

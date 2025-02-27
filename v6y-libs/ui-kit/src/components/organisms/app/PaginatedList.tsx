import * as React from 'react';

import { List } from '../../atoms';
import { PaginatedListType } from '../../types';
import TextView from './TextView.tsx';

const PaginatedList = ({
    dataSource,
    pageSize = 10,
    bordered = true,
    grid,
    header,
    renderItem,
    showFooter = true,
    style,
}: PaginatedListType) => (
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
            showFooter ? <TextView content={`Total: ${dataSource?.length || 0}`} strong /> : null
        }
        style={{
            ...(style || {}),
            marginBottom: '2rem',
        }}
    />
);

export default PaginatedList;

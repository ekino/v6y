import * as React from 'react';

import { Collapse } from '../../atoms';
import { CollapseType } from '../../types';
import EmptyView from './EmptyView.tsx';

const CollapseView = ({ bordered, accordion, dataSource }: CollapseType) => {
    return (
        <>
            {(dataSource?.length || 0) > 0 ? (
                <Collapse bordered={bordered} accordion={accordion} items={dataSource} />
            ) : (
                <EmptyView />
            )}
        </>
    );
};

export default CollapseView;

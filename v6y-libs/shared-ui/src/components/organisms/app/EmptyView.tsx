import * as React from 'react';

import { Empty } from '../../atoms';
import TextView from './TextView.tsx';

const EmptyView = ({ message }: { message?: string }) => (
    <Empty description={<TextView content={message || 'No data'} />} />
);

export default EmptyView;

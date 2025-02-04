import { useNavigationAdapter } from '@v6y/shared-ui';
import { Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import * as React from 'react';

import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    return (
        <Breadcrumb
            items={
                buildBreadCrumbItems({
                    currentPage: pathname,
                    lastPage: source || '',
                    urlParams,
                }).filter((item) => item) as ItemType[]
            }
        />
    );
};

export default VitalityBreadcrumb;

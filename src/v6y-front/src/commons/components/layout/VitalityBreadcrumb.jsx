import { Breadcrumb } from 'antd';

import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig.js';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    return (
        <Breadcrumb
            items={buildBreadCrumbItems({
                currentPage: pathname,
                lastPage: source,
                urlParams,
            }).filter((item) => item)}
        />
    );
};

export default VitalityBreadcrumb;

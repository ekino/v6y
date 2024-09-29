import { Breadcrumb } from 'antd';

import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter';
import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig';

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

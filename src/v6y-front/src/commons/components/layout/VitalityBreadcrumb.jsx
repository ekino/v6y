import { Breadcrumb } from 'antd';

import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import { buildBreadCrumbItems } from '../../utils/VitalityCommonUtils.js';

const VitalityBreadcrumb = () => {
    const { pathname } = useNavigationAdapter();
    return <Breadcrumb items={buildBreadCrumbItems(pathname).filter((item) => item)} />;
};

export default VitalityBreadcrumb;

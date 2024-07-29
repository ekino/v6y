import { Breadcrumb } from 'antd';
import VitalityCommonUtils from '../../utils/VitalityCommonUtils.js';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';

const { buildBreadCrumbItems } = VitalityCommonUtils;

const VitalityBreadcrumb = () => {
    const { pathname } = useNavigationAdapter();
    return <Breadcrumb items={buildBreadCrumbItems(pathname).filter((item) => item)} />;
};

export default VitalityBreadcrumb;

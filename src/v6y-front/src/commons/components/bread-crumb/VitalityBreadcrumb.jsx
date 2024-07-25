import { Breadcrumb } from 'antd';
import { usePathname } from 'next/navigation.js';
import { buildBreadCrumbItems } from './VitalityBreadCrumbConfig.js';

const VitalityBreadcrumb = () => {
    const pathname = usePathname();

    return (
        <Breadcrumb
            style={{
                margin: '1rem',
                padding: '1rem',
            }}
            items={buildBreadCrumbItems(pathname).filter((item) => item)}
        />
    );
};

export default VitalityBreadcrumb;

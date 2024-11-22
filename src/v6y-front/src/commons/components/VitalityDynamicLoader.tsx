import React from 'react';
import dynamic from 'next/dynamic';
import VitalityLoader from './VitalityLoader';

interface DynamicComponentProps {
    [key: string]:  unknown; 
}

const VitalityLoading = () => <VitalityLoader />;

const DynamicComponent = (path : string) => {
    switch (path) {
        case 'VitalityAppListHeader':
            return dynamic(() => import('../../features/app-list/components/VitalityAppListHeader'), { loading: VitalityLoading });
        case 'VitalityHelpView':
            return dynamic(() => import('./help/VitalityHelpView'), { loading: VitalityLoading });
        case 'VitalityGeneralInformationView':
            return dynamic(() => import('../../features/app-details/components/infos/VitalityGeneralInformationView'), { loading: VitalityLoading });
        case 'VitalityAuditReportsView':
            return dynamic(() => import('../../features/app-details/components/audit-reports/VitalityAuditReportsView'), { loading: VitalityLoading });
        case 'VitalityQualityIndicatorsView':
            return dynamic(() => import('../../features/app-details/components/quality-indicators/VitalityQualityIndicatorsView'), { loading: VitalityLoading });
        case 'VitalityDependenciesView':
            return dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesView'), { loading: VitalityLoading });
        case 'VitalityEvolutionsView':
            return dynamic(() => import('../../features/app-details/components/evolutions/VitalityEvolutionsView'), { loading: VitalityLoading });
        case 'VitalityAppInfos':
            return dynamic(() => import('../../commons/components/application-info/VitalityAppInfos'), { loading: VitalityLoading });
        case 'VitalityDependenciesBranchGrouper':
            return dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesBranchGrouper'), { loading: VitalityLoading });
        case 'VitalityDependenciesStatusGrouper':
            return dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesStatusGrouper'), { loading: VitalityLoading });
        case 'VitalityEvolutionStatusGrouper':
            return dynamic(() => import('../../features/app-details/components/evolutions/VitalityEvolutionStatusGrouper'), { loading: VitalityLoading });
        case 'VitalityModulesView':
            return dynamic(() => import('../../commons/components/modules/VitalityModulesView'), { loading: VitalityLoading });
        case 'VitalityCodeStatusReportsBranchGrouper':
            return dynamic(() => import('../../features/app-details/components/audit-reports/auditors/code-status/VitalityCodeStatusReportsBranchGrouper'), { loading: VitalityLoading });
        case 'VitalityLighthouseReportsDeviceGrouper':
            return dynamic(() => import('../../features/app-details/components/audit-reports/auditors/lighthouse/VitalityLighthouseReportsDeviceGrouper'), { loading: VitalityLoading });
        case 'VitalityLighthouseReportsCategoryGrouper':
            return dynamic(() => import('../../features/app-details/components/audit-reports/auditors/lighthouse/VitalityLighthouseReportsCategoryGrouper'), { loading: VitalityLoading });
        case 'VitalityCodeStatusReportsSmellGrouper':
            return dynamic(() => import('../../features/app-details/components/audit-reports/auditors/code-status/VitalityCodeStatusReportsSmellGrouper'), { loading: VitalityLoading });
        case 'VitalityQualityIndicatorStatusGrouper':
            return dynamic(() => import('../../features/app-details/components/quality-indicators/VitalityQualityIndicatorStatusGrouper'), { loading: VitalityLoading });
        default:
            throw new Error(`Unknown path: ${path}`);
    }
};

const VitalityDynamicLoader = (path: string): React.ComponentType<DynamicComponentProps> => {
    return DynamicComponent(path);
}

export default VitalityDynamicLoader;
import React from "react";
import dynamic from "next/dynamic";
import Matcher from "@/infrastructure/utils/Matcher";

import VitalityLoader from "../components/VitalityLoader";

const VitalityLoading = () => <VitalityLoader />;

export const buildPathConfig = (path: string) => 
Matcher()
    .with(
        () => path === 'VitalityAppListHeader',
        () => dynamic(() => import('../../features/app-list/components/VitalityAppListHeader'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityAppList',
        () => dynamic(() => import('../../features/app-list/components/VitalityAppList'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityHelpView',
        () => dynamic(() => import('../../commons/components/help/VitalityHelpView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityGeneralInformationView',
        () => dynamic(() => import('../../features/app-details/components/infos/VitalityGeneralInformationView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityAuditReportsView',
        () => dynamic(() => import('../../features/app-details/components/audit-reports/VitalityAuditReportsView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityQualityIndicatorsView',
        () => dynamic(() => import('../../features/app-details/components/quality-indicators/VitalityQualityIndicatorsView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityDependenciesView',
        () => dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityEvolutionsView',
        () => dynamic(() => import('../../features/app-details/components/evolutions/VitalityEvolutionsView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityAppInfos',
        () => dynamic(() => import('../../commons/components/application-info/VitalityAppInfos'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityDependenciesBranchGrouper',
        () => dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesBranchGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityDependenciesStatusGrouper',
        () => dynamic(() => import('../../features/app-details/components/dependencies/VitalityDependenciesStatusGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityEvolutionStatusGrouper',
        () => dynamic(() => import('../../features/app-details/components/evolutions/VitalityEvolutionStatusGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityModulesView',
        () => dynamic(() => import('../../commons/components/modules/VitalityModulesView'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityCodeStatusReportsBranchGrouper',
        () => dynamic(() => import('../../features/app-details/components/audit-reports/auditors/code-status/VitalityCodeStatusReportsBranchGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityLighthouseReportsDeviceGrouper',
        () => dynamic(() => import('../../features/app-details/components/audit-reports/auditors/lighthouse/VitalityLighthouseReportsDeviceGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityLighthouseReportsCategoryGrouper',
        () => dynamic(() => import('../../features/app-details/components/audit-reports/auditors/lighthouse/VitalityLighthouseReportsCategoryGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityCodeStatusReportsSmellGrouper',
        () => dynamic(() => import('../../features/app-details/components/audit-reports/auditors/code-status/VitalityCodeStatusReportsSmellGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalityQualityIndicatorStatusGrouper',
        () => dynamic(() => import('../../features/app-details/components/quality-indicators/VitalityQualityIndicatorStatusGrouper'), { loading: VitalityLoading })
    )
    .with(
        () => path === 'VitalitySelectableIndicators',
        () => dynamic(() => import('../../commons/components/indicators/VitalitySelectableIndicators'), { loading: VitalityLoading })
    )
    .otherwise(() => { throw new Error(`Unknown path: ${path}`) });

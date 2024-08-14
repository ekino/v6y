import { InfoOutlined } from '@ant-design/icons';

import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import VitalityLinks from '../../../commons/components/VitalityLinks.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsInfos from '../api/getAppDetailsInfos.js';

const VitalityAppDetailsInfosView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery({
        queryCacheKey: ['getAppDetailsInfos', appId],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppDetailsInfos,
                queryParams: {
                    appId,
                },
            }),
    });

    if (isAppDetailsInfosLoading) {
        return <VitalityLoader />;
    }

    const appDetails = appDetailsInfos?.getAppDetailsInfos;

    if (!appDetails?.name?.length || !appDetails?.acronym?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalitySectionView
            title={`${appDetails?.acronym} - ${appDetails?.name}`}
            description={appDetails?.description}
            avatar={<InfoOutlined />}
        >
            <VitalityLinks
                align="center"
                links={[
                    ...(appDetails?.links || []),
                    {
                        label: appDetails?.repo?.name,
                        value: appDetails?.repo?.webUrl,
                    },
                ]}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsInfosView;

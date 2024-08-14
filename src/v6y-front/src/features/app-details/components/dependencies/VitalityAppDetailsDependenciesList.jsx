import { List, Typography } from 'antd';

import VitalityAppDetailsDependenciesListItem from './VitalityAppDetailsDependenciesListItem.jsx';

const VitalityAppDetailsDependenciesList = ({ dependencies }) => {
    return (
        <List
            bordered
            itemLayout="vertical"
            dataSource={dependencies}
            pagination={{
                position: 'bottom',
                align: 'center',
                pageSize: 10,
                hideOnSinglePage: true,
            }}
            renderItem={(dependency) => (
                <VitalityAppDetailsDependenciesListItem dependency={dependency} />
            )}
            footer={
                <Typography.Text strong>
                    {`Total dependencies: ${dependencies?.length || 0}`}
                </Typography.Text>
            }
            style={{ marginBottom: '2rem' }}
        />
    );
};

export default VitalityAppDetailsDependenciesList;

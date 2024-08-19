import { List, Typography } from 'antd';

const VitalityPaginatedList = ({ dataSource, pageSize = 10, renderItem }) => (
    <List
        bordered
        itemLayout="vertical"
        dataSource={dataSource}
        pagination={{
            position: 'bottom',
            align: 'center',
            pageSize,
            hideOnSinglePage: true,
        }}
        renderItem={renderItem}
        footer={<Typography.Text strong>{`Total: ${dataSource?.length || 0}`}</Typography.Text>}
        style={{ marginBottom: '2rem' }}
    />
);

export default VitalityPaginatedList;

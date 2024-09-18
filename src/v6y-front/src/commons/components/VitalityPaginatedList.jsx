import { List, Typography } from 'antd';

const VitalityPaginatedList = ({
    dataSource,
    pageSize = 10,
    bordered = true,
    grid,
    header,
    renderItem,
    style,
}) => (
    <List
        bordered={bordered}
        itemLayout="vertical"
        dataSource={dataSource}
        grid={grid}
        pagination={{
            position: 'bottom',
            align: 'center',
            pageSize,
            hideOnSinglePage: true,
        }}
        renderItem={renderItem}
        header={header}
        footer={<Typography.Text strong>{`Total: ${dataSource?.length || 0}`}</Typography.Text>}
        style={{
            ...(style || {}),
            marginBottom: '2rem',
        }}
    />
);

export default VitalityPaginatedList;

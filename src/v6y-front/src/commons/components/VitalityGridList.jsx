import { List } from 'antd';

const VitalityGridList = ({ bordered, dataSource, renderItem }) => (
    <List
        bordered={bordered}
        grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
        }}
        dataSource={dataSource}
        renderItem={renderItem}
        style={{ paddingTop: '1rem' }}
    />
);

export default VitalityGridList;

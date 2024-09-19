import { Empty, Typography } from 'antd';

const VitalityEmptyView = ({ message }) => (
    <Empty description={<Typography.Text>{message}</Typography.Text>} />
);

export default VitalityEmptyView;

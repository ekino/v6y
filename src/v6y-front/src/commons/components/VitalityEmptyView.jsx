import { Empty, Typography } from 'antd';
import VitalityTerms from '../config/VitalityTerms.js';

const VitalityEmptyView = () => (
    <Empty
        description={<Typography.Text>{VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE}</Typography.Text>}
    />
);

export default VitalityEmptyView;

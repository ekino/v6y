import { Empty, Typography } from 'antd';
import CommonsDico from '../dico/CommonsDico.js';

const VitalityEmptyView = () => (
    <Empty
        description={<Typography.Text>{CommonsDico.VITALITY_EMPTY_DATA_MESSAGE}</Typography.Text>}
    />
);

export default VitalityEmptyView;

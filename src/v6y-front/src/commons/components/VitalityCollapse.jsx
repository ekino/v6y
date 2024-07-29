import { Collapse } from 'antd';

const VitalityCollapse = ({ bordered, accordion, dataSource }) => (
    <Collapse
        bordered={bordered}
        accordion={accordion}
        items={dataSource}
        style={{ marginBottom: '2rem' }}
    />
);

export default VitalityCollapse;

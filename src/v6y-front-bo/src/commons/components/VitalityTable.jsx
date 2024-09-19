import { Table } from 'antd';

const VitalityTable = ({ dataSource, columns }) => (
    <Table dataSource={dataSource} columns={columns} rowKey="key" />
);

export default VitalityTable;

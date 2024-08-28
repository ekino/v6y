import { Table } from 'antd';

const VitalityTable = ({ dataSource, columns, options }) => (
    <Table {...options} dataSource={dataSource} columns={columns} rowKey="key" />
);

export default VitalityTable;

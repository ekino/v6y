import { Table } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import React from 'react';

const VitalityBaseTable = ({
    dataSource,
    columns,
}: {
    dataSource: AnyObject[];
    columns: AnyObject[];
}) => <Table dataSource={dataSource} columns={columns} rowKey="key" />;

export default VitalityBaseTable;

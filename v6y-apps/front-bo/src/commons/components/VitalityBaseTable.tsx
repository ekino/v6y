import { Table, TableType } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityBaseTable = ({ dataSource, columns }: TableType) => (
    <Table dataSource={dataSource} columns={columns} rowKey="key" />
);

export default VitalityBaseTable;

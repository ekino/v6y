'use client';

import React from 'react';
import { Col, Input, Row, Typography } from 'antd';

const { Search } = Input;

const VitalitySearchBar = ({ helper, status, placeholder, onSearchChanged }) => {
    return (
        <Row justify="center" align="middle" gutter={[12, 6]}>
            <Col span={20}>
                <Search
                    status={status}
                    placeholder={placeholder}
                    onSearch={onSearchChanged}
                    enterButton
                />
            </Col>
            <Col span={20}>
                <Typography.Text>{helper}</Typography.Text>
            </Col>
        </Row>
    );
};

export default VitalitySearchBar;

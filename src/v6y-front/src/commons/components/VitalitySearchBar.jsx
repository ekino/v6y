'use client';

import { Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';

const { Search } = Input;

const VitalitySearchBar = ({ helper, label, status, placeholder, onSearchChanged }) => {
    return (
        <Row justify="center" align="middle" gutter={[12, 6]}>
            <Col span={20}>
                <Form layout="vertical">
                    <Form.Item
                        name="vitality_search"
                        label={<Typography.Text>{label}</Typography.Text>}
                        help={<Typography.Text>{helper}</Typography.Text>}
                    >
                        <Search
                            enterButton
                            status={status}
                            placeholder={placeholder}
                            onSearch={onSearchChanged}
                            style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                        />
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default VitalitySearchBar;

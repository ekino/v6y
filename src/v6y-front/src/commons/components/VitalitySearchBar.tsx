'use client';

import { Col, Form, Input, Row, Typography } from 'antd';
import * as React from 'react';

import useNavigationAdapter from '../../infrastructure/adapters/navigation/useNavigationAdapter';
import VitalityNavigationPaths from '../config/VitalityNavigationPaths';
import { VitalitySearchBarProps } from '../types/VitalitySearchBarProps';

const { Search } = Input;

const VitalitySearchBar = ({ helper, label, status, placeholder }: VitalitySearchBarProps) => {
    const { router, pathname, getUrlParams, creatUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [searchText] = getUrlParams(['searchText']);

    const handleOnSearchChanged = (value: string) => {
        if (pathname === VitalityNavigationPaths.DASHBOARD) {
            const queryParams = creatUrlQueryParam('searchText', value);
            router.push(`/search?${queryParams}`);
            return;
        }

        if (value?.length) {
            const queryParams = creatUrlQueryParam('searchText', value);
            router.replace(`${pathname}?${queryParams}`);
        } else {
            const queryParams = removeUrlQueryParam('searchText');
            router.replace(`${pathname}?${queryParams}`);
        }
    };

    return (
        <Row justify="center" align="middle" gutter={[12, 6]}>
            <Col span={22}>
                <Form layout="vertical">
                    <Form.Item
                        name="vitality_search"
                        label={<Typography.Text>{label}</Typography.Text>}
                        help={<Typography.Text>{helper}</Typography.Text>}
                        initialValue={searchText}
                    >
                        <Search
                            enterButton
                            allowClear
                            status={status}
                            placeholder={placeholder}
                            onSearch={handleOnSearchChanged}
                            style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                        />
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default VitalitySearchBar;

'use client';

import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText';
import { Col, Form, Input, Row } from 'antd';
import * as React from 'react';

import useNavigationAdapter from '../../infrastructure/adapters/navigation/useNavigationAdapter';
import VitalityNavigationPaths from '../config/VitalityNavigationPaths';
import { VitalitySearchBarProps } from '../types/VitalitySearchBarProps';

const { Search } = Input;

const VitalitySearchBar = ({ helper, label, status, placeholder }: VitalitySearchBarProps) => {
    const { router, pathname, getUrlParams, createUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [searchText] = getUrlParams(['searchText']);

    const handleOnSearchChanged = (value: string) => {
        if (pathname === VitalityNavigationPaths.DASHBOARD) {
            const queryParams = createUrlQueryParam('searchText', value);
            router.push(`/search?${queryParams}`);
            return;
        }

        if (value?.length) {
            const queryParams = createUrlQueryParam('searchText', value);
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
                        label={<VitalityText text={label} />}
                        help={<VitalityText text={helper || ''} />}
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

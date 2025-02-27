'use client';

import { Col, Form, Input, Row, TextView, useNavigationAdapter } from '@v6y/ui-kit';
import * as React from 'react';

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
                        label={<TextView content={label} />}
                        help={<TextView content={helper || ''} />}
                        initialValue={searchText}
                    >
                        <Search
                            enterButton
                            allowClear
                            status={status}
                            placeholder={placeholder}
                            onSearch={handleOnSearchChanged}
                        />
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default VitalitySearchBar;

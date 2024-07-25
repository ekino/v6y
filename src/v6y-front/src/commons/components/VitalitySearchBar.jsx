'use client';

import React from 'react';
import { Flex, Input, Typography } from 'antd';

const { Search } = Input;

const VitalitySearchBar = ({ helper, status, placeholder, onSearchChanged }) => {
    return (
        <Flex
            align="center"
            justify="center"
            vertical
            style={{ width: '100%', margin: '2rem auto' }}
        >
            <div style={{ width: '50%' }}>
                <Search
                    status={status}
                    placeholder={placeholder}
                    onSearch={onSearchChanged}
                    enterButton
                />
                <div style={{ marginTop: '5px' }}>
                    <Typography.Text>{helper}</Typography.Text>
                </div>
            </div>
        </Flex>
    );
};

export default VitalitySearchBar;

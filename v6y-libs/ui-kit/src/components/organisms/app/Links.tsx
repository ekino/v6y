import { LinkType } from '@v6y/core-logic';
import Link from 'next/link';
import * as React from 'react';

import { Col, Row } from '../../atoms';
import { LinksType } from '../../types';
import TextView from './TextView.tsx';

const Links = ({ links, align }: LinksType) => {
    const dataSource = (links || [])
        .filter((link) => link.label?.length && link.value?.length)
        .reduce(
            (acc, next) => ({
                ...acc,
                [`${next.label?.split(' ')?.join('-')}-${next.value}`]: next,
            }),
            {},
        );

    if (!Object.keys(dataSource || {})?.length) {
        return null;
    }

    return (
        <Row gutter={[12, 12]} justify={align || 'end'} align="middle">
            {Object.keys(dataSource || {})?.map((key, index) => {
                const link = dataSource[key as keyof typeof dataSource] as LinkType;
                return (
                    <Col key={`${link.label}-${index}`}>
                        {link.value?.length && (
                            <Link href={link.value} target="_blank" rel="noopener noreferrer">
                                <TextView content={link.label} />
                            </Link>
                        )}
                    </Col>
                );
            })}
        </Row>
    );
};

export default Links;

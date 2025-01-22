import { LinkType } from '@v6y/core-logic';
import { VitalityText } from '@v6y/shared-ui';
import { Col, Row } from 'antd';
import Link from 'next/link';
import * as React from 'react';

type ContentJustify =
    | 'end'
    | 'start'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | undefined;

const VitalityLinks = ({ links, align }: { links: LinkType[]; align: ContentJustify }) => {
    const dataSource: Record<string, LinkType> = (links || [])
        .filter((link) => link.value?.length)
        .reduce(
            (acc, next) => ({
                ...acc,
                [`${next.label}-${next.value}`]: next,
            }),
            {},
        );

    return (
        <Row gutter={[12, 12]} justify={align || 'end'} align="middle">
            {Object.keys(dataSource || {})?.map((key, index) => {
                const link = dataSource[key];
                return (
                    <Col key={`${link.label}-${index}`}>
                        <Link
                            href={link.value || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'underline' }}
                        >
                            <VitalityText text={link.label} />
                        </Link>
                    </Col>
                );
            })}
        </Row>
    );
};

export default VitalityLinks;

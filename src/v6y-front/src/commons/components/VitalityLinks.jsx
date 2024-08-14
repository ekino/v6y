import { Col, Row, Typography } from 'antd';
import Link from 'next/link';

const VitalityLinks = ({ links, align }) => (
    <>
        {links && (
            <Row gutter={[12, 12]} justify={align || 'end'} align="middle">
                {links
                    .filter((link) => link.value?.length)
                    .map((link, index) => (
                        <Col key={`${link.label}-${index}`}>
                            <Link
                                href={link.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'underline' }}
                            >
                                <Typography.Text>{link.label}</Typography.Text>
                            </Link>
                        </Col>
                    ))}
            </Row>
        )}
    </>
);

export default VitalityLinks;

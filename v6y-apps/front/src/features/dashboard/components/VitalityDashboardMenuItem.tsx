import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText/VitalityText';
import { VitalityTitle } from '@v6y/shared-ui/src/components/VitalityTitle/VitalityTitle';
import { Avatar, Card } from 'antd';
import Link from 'next/link';
import * as React from 'react';

import { DashboardItemType } from '../../../commons/config/VitalityCommonConfig';

const VitalityDashboardMenuItem = ({ option }: { option: DashboardItemType }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url} style={{ textDecoration: 'none' }}>
            <Card bordered hoverable>
                <Card.Meta
                    avatar={
                        <Avatar
                            size={32}
                            icon={option.avatar}
                            style={{ backgroundColor: option.avatarColor }}
                        />
                    }
                    title={<VitalityTitle title={option.title} level={4} underline />}
                    description={<VitalityText text={option.description} />}
                />
            </Card>
        </Link>
    );
};

export default VitalityDashboardMenuItem;

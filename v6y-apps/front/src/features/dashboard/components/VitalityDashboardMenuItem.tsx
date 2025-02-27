import { Avatar, Card, TextView, TitleView } from '@v6y/shared-ui';
import Link from 'next/link';
import * as React from 'react';

import { DashboardItemType } from '../../../commons/config/VitalityCommonConfig';

const VitalityDashboardMenuItem = ({ option }: { option: DashboardItemType }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url}>
            <Card bordered hoverable>
                <Card.Meta
                    avatar={
                        <Avatar
                            size={32}
                            icon={option.avatar}
                            style={{ backgroundColor: option.avatarColor }}
                        />
                    }
                    title={<TitleView title={option.title} level={4} underline />}
                    description={<TextView content={option.description} />}
                />
            </Card>
        </Link>
    );
};

export default VitalityDashboardMenuItem;

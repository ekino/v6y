'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import { TitleProps } from '@refinedev/core';
import * as React from 'react';

type AdminPageLayoutProps = {
    title: React.FC;
    header?: React.FC;
    footer?: React.FC;
    displaySider?: boolean;
    children: React.ReactNode;
};

type SiderProps = {
    Title?: React.FC<TitleProps>;
    render?: (props: {
        items: React.JSX.Element[];
        logout: React.ReactNode;
        dashboard: React.ReactNode;
        collapsed: boolean;
    }) => React.ReactNode;
    meta?: Record<string, unknown>;
};

interface LayoutProps {
    Title: React.FC;
    Header?: React.FC;
    Footer?: React.FC;
    Sider?: React.FC<SiderProps>;
    className?: string;
}

const NullSider: React.FC<SiderProps> = () => null;

const AdminLayout = ({ title, header, footer, children, displaySider }: AdminPageLayoutProps) => {
    const layoutProps = React.useMemo(() => {
        const props: LayoutProps = {
            Title: title,
            Header: header,
            Footer: footer,
            className: 'h-auto',
        };
        if (displaySider === false) {
            props.Sider = NullSider;
        }
        return props;
    }, [title, header, footer, displaySider]);

    return (
        <ThemedLayoutV2 key={displaySider ? 'with-sider' : 'without-sider'} {...layoutProps}>
            {children}
        </ThemedLayoutV2>
    );
};

export default AdminLayout;

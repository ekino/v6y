import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils';
import { badgeVariants } from './badge-variants';

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };

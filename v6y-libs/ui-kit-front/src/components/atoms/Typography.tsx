import { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/utils';

type TypographyProps = {
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

function TypographyH1({ children, ...props }: TypographyProps) {
    return (
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance" {...props}>
            {children}
        </h1>
    );
}

function TypographyH2({ children, ...props }: TypographyProps) {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props}>
            {children}
        </h2>
    );
}

function TypographyH3({ children, ...props }: TypographyProps) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight" {...props}>
            {children}
        </h3>
    );
}

function TypographyH4({ children, ...props }: TypographyProps) {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
            {children}
        </h4>
    );
}

function TypographyP({ children, muted, className, ...props }: TypographyProps & { muted?: boolean }) {
    return (
        <p
            className={cn('leading-7 font-normal [&:not(:first-child)]:mt-6', muted && 'text-slate-500', className)}
            {...props}
        >
            {children}
        </p>
    );
}

function TypographyBlockquote({ children, ...props }: TypographyProps) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
            {children}
        </blockquote>
    );
}

function TypographyInlineCode({ children, ...props }: TypographyProps) {
    return (
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>
            {children}
        </code>
    );
}

function TypographyLead({ children, ...props }: TypographyProps) {
    return (
        <p className="text-muted-foreground text-xl" {...props}>
            {children}
        </p>
    );
}

function TypographyLarge({ children, ...props }: TypographyProps) {
    return (
        <div className="text-lg font-semibold" {...props}>
            {children}
        </div>
    );
}

function TypographySmall({ children, ...props }: TypographyProps) {
    return (
        <small className="text-sm leading-none font-medium" {...props}>
            {children}
        </small>
    );
}

function TypographyMuted({ children, ...props }: TypographyProps) {
    return (
        <p className="text-muted-foreground text-sm" {...props}>
            {children}
        </p>
    );
}

export {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
    TypographyBlockquote,
    TypographyInlineCode,
    TypographyLead,
    TypographyLarge,
    TypographySmall,
    TypographyMuted,
};

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../lib/utils";

type TypographyProps = {
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function TypographyH1({ children, ...props }: TypographyProps) {
    return (
        <h1
            className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
            {...props}
        >
            {children}
        </h1>
    );
}

export function TypographyH2({ children, ...props }: TypographyProps) {
    return (
        <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
            {...props}
        >
            {children}
        </h2>
    );
}

export function TypographyH3({ children, ...props }: TypographyProps) {
    return (
        <h3
            className="scroll-m-20 text-2xl font-semibold tracking-tight"
            {...props}
        >
            {children}
        </h3>
    );
}

export function TypographyH4({ children, ...props }: TypographyProps) {
    return (
        <h4
            className="scroll-m-20 text-xl font-semibold tracking-tight"
            {...props}
        >
            {children}
        </h4>
    );
}

export function TypographyP({ children, muted, className, ...props }: TypographyProps & { muted?: boolean }) {
    return (
        <p className={cn(
        "leading-7 font-normal [&:not(:first-child)]:mt-6",
        muted && "text-slate-500",
        className
    )} {...props}>
            {children}
        </p>
    );
}

export function TypographyBlockquote({ children, ...props }: TypographyProps) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
            {children}
        </blockquote>
    );
}

export function TypographyInlineCode({ children, ...props }: TypographyProps) {
    return (
        <code
            className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
            {...props}
        >
            {children}
        </code>
    );
}

export function TypographyLead({ children, ...props }: TypographyProps) {
    return (
        <p className="text-muted-foreground text-xl" {...props}>
            {children}
        </p>
    );
}

export function TypographyLarge({ children, ...props }: TypographyProps) {
    return (
        <div className="text-lg font-semibold" {...props}>
            {children}
        </div>
    );
}

export function TypographySmall({ children, ...props }: TypographyProps) {
    return (
        <small className="text-sm leading-none font-medium" {...props}>
            {children}
        </small>
    );
}

export function TypographyMuted({ children, ...props }: TypographyProps) {
    return (
        <p className="text-muted-foreground text-sm" {...props}>
            {children}
        </p>
    );
}

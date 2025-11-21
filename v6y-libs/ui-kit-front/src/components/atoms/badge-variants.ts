import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                // use explicit Tailwind colors instead of token names
                default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
                success: 'border-transparent bg-green-400 text-white shadow hover:bg-slate-200',
                warning: 'border-transparent bg-orange-400 text-white hover:bg-slate-300',
                error: 'border-transparent bg-red-500 text-white shadow hover:bg-red-200',
                outline: 'text-slate-900',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export default badgeVariants;

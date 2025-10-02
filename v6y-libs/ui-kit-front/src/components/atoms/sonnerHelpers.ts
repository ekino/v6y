import { toast as sonnerToast } from 'sonner';

export const toast: typeof sonnerToast = sonnerToast;
export const toasterStyle = {
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
} as React.CSSProperties;

import { toast as sonnerToast } from 'sonner';

export const toast: typeof sonnerToast = sonnerToast;
export const toasterStyle = {
    '--normal-bg': 'rgba(255, 255, 255, 0.96)',
    '--normal-text': '#111827',
    '--normal-border': 'rgba(17, 24, 39, 0.15)',
} as React.CSSProperties;

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { toasterStyle } from './sonnerHelpers';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

    return (
        <Sonner theme={theme as ToasterProps['theme']} className="toaster group" style={toasterStyle} {...props} />
    );
};

export { Toaster };

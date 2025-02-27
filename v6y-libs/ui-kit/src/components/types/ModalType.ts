import { ReactNode } from 'react';

export interface ModalType {
    title?: ReactNode;
    isOpen?: boolean;
    onCloseModal?: () => void;
    children?: ReactNode;
}

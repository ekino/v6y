import { Button, Divider, Modal } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';

interface VitalityModalProps {
    title?: ReactNode;
    isOpen?: boolean;
    onCloseModal?: () => void;
    children?: ReactNode;
}

const VitalityModal = ({ title, isOpen, onCloseModal, children }: VitalityModalProps) => {
    return (
        <Modal
            centered
            closable
            title={
                <>
                    {title}
                    <Divider plain />
                </>
            }
            open={isOpen}
            footer={
                <>
                    <Divider plain />
                    <Button type="primary" onClick={onCloseModal}>
                        OK
                    </Button>
                </>
            }
            width={600}
            styles={{
                body: { overflowY: 'auto', overflowX: 'hidden', maxHeight: 'calc(100vh - 350px)' },
            }}
            onCancel={onCloseModal}
        >
            {children}
        </Modal>
    );
};

export default VitalityModal;

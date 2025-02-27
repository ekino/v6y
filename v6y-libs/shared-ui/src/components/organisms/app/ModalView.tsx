import * as React from 'react';

import { Button, Divider, Modal } from '../../atoms';
import { ModalType } from '../../types';

const ModalView = ({ title, isOpen, onCloseModal, children }: ModalType) => {
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

export default ModalView;

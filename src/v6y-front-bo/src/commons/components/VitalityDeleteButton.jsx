import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteButton } from '@refinedev/core';
import { Button, Popconfirm } from 'antd';
import React from 'react';

export const VitalityDeleteButton = ({
    size,
    deleteQuery,
    deleteOperation,
    recordItemId,
    hideText,
    children,
}) => {
    const {
        title,
        label,
        hidden,
        disabled,
        confirmTitle: defaultConfirmTitle,
        confirmOkLabel: defaultConfirmOkLabel,
        cancelLabel: defaultCancelLabel,
        loading: isLoading,
        onConfirm,
    } = useDeleteButton({
        id: recordItemId,
        meta: {
            operation: deleteOperation,
            gqlMutation: deleteQuery,
        },
    });

    if (hidden) return null;

    return (
        <Popconfirm
            key="delete"
            okText={defaultConfirmOkLabel}
            cancelText={defaultCancelLabel}
            okType="danger"
            title={defaultConfirmTitle}
            okButtonProps={{ disabled: isLoading }}
            onConfirm={onConfirm}
            disabled={disabled}
        >
            <Button
                danger
                loading={isLoading}
                icon={<DeleteOutlined />}
                title={title}
                disabled={disabled}
                size={size}
                data-testid="refine-delete-button"
                className="refine-delete-button"
            >
                {!hideText && (children ?? label)}
            </Button>
        </Popconfirm>
    );
};

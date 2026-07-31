import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

// `setupTests.tsx` replaces the whole ui-kit with lightweight stubs whose `Form`
// has no `useFormInstance`/`useWatch`. This field is built on top of those two
// hooks and on the real form store's notification cycle, which is exactly what
// the hydration bug lived in, so the real ui-kit form primitives are restored
// here rather than stubbed.
vi.mock('@v6y/ui-kit', async () => {
    const [Flex, Form, Input, Select, Switch, Typography] = await Promise.all([
        import('@v6y/ui-kit/src/components/atoms/app/Flex.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Form.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Input.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Select.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Switch.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Typography.tsx'),
    ]);

    return {
        Flex: Flex.default,
        Form: Form.default,
        Input: Input.default,
        Select: Select.default,
        Switch: Switch.default,
        Text: Typography.Text,
    };
});

const { default: VitalityAuditFrequencyField } = await import(
    '../commons/components/VitalityAuditFrequencyField'
);
const { Form } = await import('@v6y/ui-kit');

type FormInstance = ReturnType<typeof Form.useForm>[0];

const mockTranslate = vi.fn((key: string, params?: Record<string, unknown>) =>
    params?.cron ? `${key}:${params.cron}` : key,
) as never;

/**
 * Mirrors how `AdminEditWrapper` uses the field: the form is rendered first and
 * only filled from the API in an effect, so the field observes `undefined` values
 * on its first render and the saved ones on the next.
 */
const HydratedAuditFrequencyForm = ({
    values,
    onFormReady,
}: {
    values: Record<string, unknown>;
    onFormReady: (form: FormInstance) => void;
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        onFormReady(form);
        form.setFieldsValue(values);
    }, [form, onFormReady, values]);

    return (
        <Form form={form} layout="vertical">
            <VitalityAuditFrequencyField groupTitle="Audit scheduling" translate={mockTranslate} />
        </Form>
    );
};

const renderHydratedField = (values: Record<string, unknown>) => {
    let form: FormInstance | undefined;

    render(
        <HydratedAuditFrequencyForm
            values={values}
            onFormReady={(instance) => {
                form = instance;
            }}
        />,
    );

    return () => form as FormInstance;
};

describe('VitalityAuditFrequencyField', () => {
    it('should keep the saved count when the form is hydrated after the first render', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-period': 'day',
            'app-audit-frequency-count': 4,
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-period')).toBe('day');
        });

        // The period/count reset must not treat the initial `undefined` -> saved
        // value transition as a period change, otherwise the count Select comes up
        // empty and its `required` rule blocks every later save.
        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-count')).toBe(4);
        });

        expect(
            await screen.findByText(
                'v6y-applications.fields.app-audit-frequency-preview:0 */6 * * *',
            ),
        ).toBeInTheDocument();
    });

    it('should clear the count when the admin changes the period', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-period': 'day',
            'app-audit-frequency-count': 4,
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-count')).toBe(4);
        });

        getForm().setFieldValue('app-audit-frequency-period', 'week');

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-count')).toBeUndefined();
        });
    });

    it('should surface a schedule the presets cannot express instead of an empty selection', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-cron': '0 30 3 * * 1-5',
        });

        expect(
            await screen.findByText(
                'v6y-applications.fields.app-audit-frequency-custom:0 30 3 * * 1-5',
            ),
        ).toBeInTheDocument();

        // Nothing to validate: the expression is carried through as-is, so the
        // period/count rules must not fire on an otherwise untouched form.
        await expect(getForm().validateFields()).resolves.toBeDefined();
    });

    it('should hide the audit frequency selects while scheduling is disabled', async () => {
        renderHydratedField({ 'app-audit-frequency-enabled': false });

        await waitFor(() => {
            expect(
                screen.queryByText('v6y-applications.fields.app-audit-frequency-period.label'),
            ).not.toBeInTheDocument();
        });
    });
});

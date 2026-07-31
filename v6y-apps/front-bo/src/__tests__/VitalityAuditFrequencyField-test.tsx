import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

// `setupTests.tsx` replaces the whole ui-kit with lightweight stubs whose `Form`
// has no `useFormInstance`/`useWatch`. This field is built on those two hooks and
// on the real form store's validation, which is what the tests below exercise, so
// the actual ui-kit form primitives are restored here rather than stubbed.
vi.mock('@v6y/ui-kit', async () => {
    const [Flex, Form, Input, Switch, Typography] = await Promise.all([
        import('@v6y/ui-kit/src/components/atoms/app/Flex.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Form.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Input.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Switch.tsx'),
        import('@v6y/ui-kit/src/components/atoms/app/Typography.tsx'),
    ]);

    return {
        Flex: Flex.default,
        Form: Form.default,
        Input: Input.default,
        Switch: Switch.default,
        Text: Typography.Text,
    };
});

const { default: VitalityAuditFrequencyField } = await import(
    '../commons/components/VitalityAuditFrequencyField'
);
const { AUDIT_FREQUENCY_EXAMPLES } = await import('../commons/utils/AuditFrequencyUtils');
const { Form } = await import('@v6y/ui-kit');

type FormInstance = ReturnType<typeof Form.useForm>[0];

const mockTranslate = vi.fn((key: string) => key) as never;

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

const CRON_FIELD_KEY = 'v6y-applications.fields.app-audit-frequency-cron';

describe('VitalityAuditFrequencyField', () => {
    it('should keep the saved cron expression once the form is hydrated', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-cron': '30 3 * * 1-5',
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-cron')).toBe('30 3 * * 1-5');
        });
        expect(await screen.findByDisplayValue('30 3 * * 1-5')).toBeInTheDocument();
        await expect(getForm().validateFields()).resolves.toBeDefined();
    });

    it('should accept any valid expression, not only a preset one', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-cron': '15 2 * */2 *',
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-cron')).toBe('15 2 * */2 *');
        });
        await expect(getForm().validateFields()).resolves.toBeDefined();
    });

    it('should list every documented example under the input', async () => {
        renderHydratedField({ 'app-audit-frequency-enabled': true });

        expect(await screen.findByText(`${CRON_FIELD_KEY}.examples.title`)).toBeInTheDocument();

        for (const { labelKey, cron } of AUDIT_FREQUENCY_EXAMPLES) {
            expect(screen.getByText(cron)).toBeInTheDocument();
            expect(screen.getByText(`${CRON_FIELD_KEY}.examples.${labelKey}`)).toBeInTheDocument();
        }

        expect(screen.getByText(`${CRON_FIELD_KEY}.examples.timezone`)).toBeInTheDocument();
    });

    it('should refuse a malformed expression with a syntax message', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-cron': 'every minute please',
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-cron')).toBeDefined();
        });
        await expect(getForm().validateFields()).rejects.toBeDefined();

        expect(await screen.findByText(`${CRON_FIELD_KEY}.error-syntax`)).toBeInTheDocument();
    });

    it('should refuse a schedule running more than once per hour', async () => {
        const getForm = renderHydratedField({
            'app-audit-frequency-enabled': true,
            'app-audit-frequency-cron': '* * * * *',
        });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-cron')).toBe('* * * * *');
        });
        await expect(getForm().validateFields()).rejects.toBeDefined();

        expect(await screen.findByText(`${CRON_FIELD_KEY}.error-rate`)).toBeInTheDocument();
    });

    it('should require an expression once scheduling is enabled', async () => {
        const getForm = renderHydratedField({ 'app-audit-frequency-enabled': true });

        await waitFor(() => {
            expect(getForm().getFieldValue('app-audit-frequency-enabled')).toBe(true);
        });
        await expect(getForm().validateFields()).rejects.toBeDefined();

        expect(await screen.findByText(`${CRON_FIELD_KEY}.error`)).toBeInTheDocument();
    });

    it('should hide the cron input while scheduling is disabled', async () => {
        const getForm = renderHydratedField({ 'app-audit-frequency-enabled': false });

        await waitFor(() => {
            expect(screen.queryByText(`${CRON_FIELD_KEY}.label`)).not.toBeInTheDocument();
        });

        // No schedule is asked for, so nothing about it should block the save.
        await expect(getForm().validateFields()).resolves.toBeDefined();
    });
});

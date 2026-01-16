'use client';

import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { Button, PlayIcon } from '@v6y/ui-kit-front';

interface VitalityRunAuditButtonProps {
    onTriggerAudit: () => void;
    isTriggering: boolean;
    isDisabled: boolean;
    lastAuditTime: number | null;
    cooldownMs?: number;
}

const VitalityRunAuditButton: React.FC<VitalityRunAuditButtonProps> = ({
    onTriggerAudit,
    isTriggering,
    isDisabled,
    lastAuditTime,
    cooldownMs = 30000,
}) => {
    const { translate } = useTranslationProvider();
    const [cooldownRemaining, setCooldownRemaining] = React.useState(0);

    React.useEffect(() => {
        if (lastAuditTime) {
            const interval = setInterval(() => {
                const elapsed = Date.now() - lastAuditTime;
                const remaining = Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
                setCooldownRemaining(remaining);

                if (remaining === 0) {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [lastAuditTime, cooldownMs]);

    const isOnCooldown = cooldownRemaining > 0;
    const buttonDisabled = isTriggering || isDisabled || isOnCooldown;

    const getButtonTitle = () => {
        if (isOnCooldown) {
            return translate('vitality.appDetailsPage.audit.pleasewait').replace(
                '{seconds}',
                cooldownRemaining.toString(),
            );
        }
        if (isTriggering) {
            return translate('vitality.appDetailsPage.audit.inProgress');
        }
        return translate('vitality.appDetailsPage.audit.runAnalysis');
    };

    const renderButtonContent = () => {
        if (isTriggering) {
            return (
                <>
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>{translate('vitality.appDetailsPage.audit.running')}</span>
                </>
            );
        }

        if (isOnCooldown) {
            return (
                <>
                    <PlayIcon className="w-4 h-4" />
                    <span>
                        {translate('vitality.appDetailsPage.audit.waitSeconds').replace(
                            '{seconds}',
                            cooldownRemaining.toString(),
                        )}
                    </span>
                </>
            );
        }

        return (
            <>
                <PlayIcon className="w-4 h-4" />
                <span>{translate('vitality.appDetailsPage.audit.runAudit')}</span>
            </>
        );
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className={`h-8 px-3 border-slate-300 rounded-md flex items-center gap-2 transition-all ${
                buttonDisabled ? 'opacity-70 cursor-wait' : ''
            }`}
            onClick={onTriggerAudit}
            disabled={buttonDisabled}
            title={getButtonTitle()}
        >
            {renderButtonContent()}
        </Button>
    );
};

export default VitalityRunAuditButton;

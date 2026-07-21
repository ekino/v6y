import { useTranslationProvider } from '@v6y/ui-kit';
import { Button, PlayIcon, ReloadIcon } from '@v6y/ui-kit-front';

interface RunAuditButtonProps {
    isRunningAudit: boolean;
    onRunAuditClicked: () => void;
}

/**
 * "Run Audit" trigger button. Only meant for live application details views,
 * not for read-only historic report views.
 */
export const RunAuditButton = ({ isRunningAudit, onRunAuditClicked }: RunAuditButtonProps) => {
    const { translate } = useTranslationProvider();

    return (
        <Button
            onClick={onRunAuditClicked}
            disabled={isRunningAudit}
            variant="outline"
            size="sm"
            className="flex h-10 items-center gap-1.5 rounded-full border-slate-900 bg-slate-900 px-4 text-white hover:bg-slate-800"
        >
            {isRunningAudit ? (
                <>
                    <ReloadIcon className="w-4 h-4 animate-spin" />
                    <span className="text-sm">
                        {translate('vitality.appDetailsPage.runAuditButtonLoading')}
                    </span>
                </>
            ) : (
                <>
                    <PlayIcon className="w-4 h-4" />
                    <span className="text-sm">
                        {translate('vitality.appDetailsPage.runAuditButton')}
                    </span>
                </>
            )}
        </Button>
    );
};

interface RunningAuditBannerProps {
    isRunningAudit: boolean;
}

/**
 * Small pulsing banner shown alongside the Run Audit button while an audit
 * triggered from the current page is running.
 */
export const RunningAuditBanner = ({ isRunningAudit }: RunningAuditBannerProps) => {
    const { translate } = useTranslationProvider();

    if (!isRunningAudit) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 animate-pulse self-start md:self-center">
            <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-600"></span>
            </span>
            <span className="text-xs font-medium text-amber-800">
                {translate('vitality.appDetailsPage.auditToasts.running')}
            </span>
        </div>
    );
};

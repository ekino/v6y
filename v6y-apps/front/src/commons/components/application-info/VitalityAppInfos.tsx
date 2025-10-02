import {
  Badge,
  Button,
  CommitIcon,
  GlobeIcon,
  StarIcon,
  useNavigationAdapter,
  useTranslationProvider,
} from '@v6y/ui-kit-front';
import Link from 'next/link';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { VitalityAppInfosProps } from '../../types/VitalityAppInfosProps';

const VitalityAppInfos = ({
  app,
  source,
  canOpenDetails = true,
}: VitalityAppInfosProps) => {
  const { createUrlQueryParam } = useNavigationAdapter();
  const { translate } = useTranslationProvider();
  const queryParams = createUrlQueryParam('_id', `${app._id}`);
  const appDetailsLink = source
    ? VitalityNavigationPaths.APP_DETAILS +
      '?' +
      queryParams +
      '&' +
      'source=' +
      source
    : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

  const appLinks = app.links;
  const appRepository = app.repo;
  const appOpenedBranches = app.repo?.allBranches?.length || 0;

  return (
    <li className="w-full bg-white space-y-6 shadow-md p-6 rounded-lg border border-slate-100">
      <div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold flex items-center gap-x-4">
              <span className="flex items-center" aria-hidden>
                <StarIcon className="scale-125" />
              </span>
              <span data-testid="app-name">{app.name}</span>
            </h4>
          </div>

          <div className="flex-1 flex justify-end items-center gap-x-2">
            {appRepository?.gitUrl && (
              <Link href={appRepository.gitUrl}>
                <Button
                  variant="outline"
                  className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center"
                >
                  <CommitIcon />
                </Button>
              </Link>
            )}
            {appRepository?.webUrl && (
              <Link href={appRepository.webUrl}>
                <Button
                  variant="outline"
                  className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center"
                >
                  <GlobeIcon />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Badge
            variant={appOpenedBranches >= 4 ? 'warning' : 'default'}
            className="text-sm"
          >
            Branches ({appOpenedBranches})
          </Badge>
        </div>
        <div>
          {canOpenDetails && (
            <Link href={appDetailsLink}>
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-2 rounded-md">
                {translate('vitality.appListPage.seeReporting') ||
                  'See Reporting'}
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(appLinks || [])
          .filter((link) => typeof link.value === 'string')
          .map((link, id: number) => (
            <Link
              className="text-black text-xs"
              key={id}
              href={link.value as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </Link>
          ))}
      </div>

      <div>
        {app.contactMail && (
          <Link href={`mailto:${app.contactMail}`} className="text-sm text-slate-700 no-underline hover:no-underline">
            {translate('vitality.appListPage.contactEmail')}
          </Link>
        )}
      </div>
    </li>
  );
};

export default VitalityAppInfos;

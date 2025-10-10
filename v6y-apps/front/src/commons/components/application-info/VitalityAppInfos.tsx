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

const VitalityAppInfos = ({ app, source }: VitalityAppInfosProps) => {
  // TODO => Find a way to retrieve app technologies (static placeholder for now)
  const appTechnologies: { id: number; name: string }[] = [
    { id: 0, name: 'React' },
    { id: 1, name: 'NodeJS' },
    { id: 2, name: 'TypeScript' },
  ];
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

  const appRepository = app.repo;
  const appOpenedBranches = app.repo?.allBranches?.length || 0;

  return (
    <div className="w-full bg-white space-y-6 shadow-md p-6 rounded-lg border border-slate-100">
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

          <div className="flex justify-center items-center gap-x-2">
            <p className="text-sm">
              {translate('vitality.appListPage.technos')}
            </p>
            {appTechnologies.map((techno) => (
              <Badge
                key={techno.id}
                className="inline-flex items-center bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full border border-slate-200"
              >
                {techno.name}
              </Badge>
            ))}
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

        <p className="w-full text-sm font-400 mt-4">
          {translate('vitality.appListPage.lastAnalyzed')} 01/01/2024
        </p>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <p className="text-sm">Branches ({appOpenedBranches})</p>
          <Badge variant="success" className="rounded-full px-3 py-1">
            3 success
          </Badge>
          <Badge variant="warning" className="rounded-full px-3 py-1">
            2 warning
          </Badge>
          <Badge variant="error" className="rounded-full px-3 py-1">
            3 errors
          </Badge>
        </div>
        <div>
          <Link href={appDetailsLink}>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-2 rounded-md">
              {translate('vitality.appListPage.seeReporting') ||
                'See Reporting'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VitalityAppInfos;

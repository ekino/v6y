'use client';

import { VITALITY_HEADER_MENU_ITEMS } from '../../config/VitalityCommonConfig';
import { useTranslationProvider } from '@v6y/ui-kit-front';
import Link from 'next/link';

const VitalityPageHeaderMenu = () => {
  const { translate } = useTranslationProvider();

  return (
    <nav className="space-x-8">
        {VITALITY_HEADER_MENU_ITEMS.map((item, key) => (
          <Link key={key} href={item.link} className="text-black no-underline hover:no-underline">
            {translate(item.translateLabel)}
          </Link>
        ))}
    </nav>
  );
};

export default VitalityPageHeaderMenu;

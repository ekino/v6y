'use client';

import { VITALITY_HEADER_MENU_ITEMS } from '../../config/VitalityCommonConfig';
import { useTranslationProvider } from '@v6y/ui-kit-front';
import Link from 'next/link';

const VitalityPageHeaderMenu = () => {
  const { translate } = useTranslationProvider();

  return (
    <nav className="space-x-8">
      {VITALITY_HEADER_MENU_ITEMS.map((item) => (
        <Link key={item.key} className="text-black no-underline hover:text-black" href={item.link}>
          {translate(item.translateLabel)}
        </Link>
      ))}
    </nav>
  );
};

export default VitalityPageHeaderMenu;

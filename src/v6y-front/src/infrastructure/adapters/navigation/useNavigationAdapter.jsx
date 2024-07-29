'use client';

import { useSearchParams, usePathname } from 'next/navigation';

const useNavigationAdapter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    return {
        getUrlParams: (paramKeys) => paramKeys?.map((key) => searchParams.get(key)),
        pathname,
    };
};

export default useNavigationAdapter;

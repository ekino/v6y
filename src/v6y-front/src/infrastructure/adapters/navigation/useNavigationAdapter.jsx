'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useNavigationAdapter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    return {
        router,
        getUrlParams: (paramKeys) => paramKeys?.map((key) => searchParams.get(key)),
        pathname,
    };
};

export default useNavigationAdapter;

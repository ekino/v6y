'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useNavigationAdapter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const creatUrlQueryParam = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const removeUrlQueryParam = useCallback(
        (name) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);
            return params.toString();
        },
        [searchParams],
    );

    return {
        router,
        getUrlParams: (paramKeys) => paramKeys?.map((key) => searchParams.get(key)),
        creatUrlQueryParam,
        removeUrlQueryParam,
        urlParams: searchParams?.toString(),
        pathname,
    };
};

export default useNavigationAdapter;
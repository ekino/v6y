'use client';

import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useNavigationAdapter = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const creatUrlQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const removeUrlQueryParam = useCallback(
        (name: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);
            return params.toString();
        },
        [searchParams],
    );

    return {
        router,
        redirect,
        getUrlParams: (paramKeys: string[]) => paramKeys?.map((key) => searchParams.get(key)),
        creatUrlQueryParam,
        removeUrlQueryParam,
        urlParams: searchParams?.toString(),
        pathname,
    };
};

export default useNavigationAdapter;

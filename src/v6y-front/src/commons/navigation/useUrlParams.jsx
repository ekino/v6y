'use client';

import { useSearchParams } from 'next/navigation';

const useUrlParams = () => {
    const searchParams = useSearchParams();
    return {
        getUrlParams: (paramKeys) => paramKeys?.map((key) => searchParams.get(key)),
    };
};

export default useUrlParams;

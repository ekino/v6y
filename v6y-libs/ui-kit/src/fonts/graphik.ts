import localFont from 'next/font/local';

export const graphik = localFont({
    src: [
        {
            path: './graphik-light-webfont.woff',
            weight: '300',
            style: 'normal',
        },
        {
            path: './graphik-regular-webfont.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: './graphik-bold-webfont.woff',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'swap',
    fallback: ['sans-serif'],
});

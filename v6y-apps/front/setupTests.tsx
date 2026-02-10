/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup } from '@testing-library/react';
import '@v6y/ui-kit-front/styles.css';
import * as React from 'react';
import { afterEach, beforeEach, vi } from 'vitest';

vi.mock('next/dynamic', async () => {
    const dynamicModule = await vi.importActual<typeof import('next/dynamic')>('next/dynamic');
    return {
        default: (loader: () => Promise<{ default: React.ComponentType<any> }>) => {
            const DynamicComponent = dynamicModule.default(loader, { ssr: false });

            // Force preload if available
            const maybePreload = (DynamicComponent as any).preload;
            if (typeof maybePreload === 'function') {
                maybePreload();
            }

            return DynamicComponent;
        },
    };
});

vi.mock('next/navigation', () => {
    return {
        redirect: vi.fn(),
        usePathname: () => '/',
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
        }),
        useSearchParams: () => ({ get: (key: string) => null }),
    };
});

const formErrors: Record<string, { message: string }> = {};

beforeEach(() => {
    Object.keys(formErrors).forEach((key) => delete formErrors[key]);
});

afterEach(() => {
    cleanup();
});



vi.mock('@v6y/ui-kit-front/hooks/useNavigationAdapter', () => ({
    default: vi.fn(() => ({
        createUrlQueryParam: vi.fn((name: string, value: string) => `${name}=${value}`),
        removeUrlQueryParam: vi.fn(),
        getUrlParams: vi.fn(() => ['123']),
        pathname: '/dashboard',
        router: {
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
        },
    })),
}));


vi.mock('@v6y/ui-kit/components/organisms/app/EmptyView.tsx', () => ({
    default: () => <div data-testid="empty-view">No Data Available</div>,
}));

vi.mock('@v6y/ui-kit/components/organisms/app/LoaderView.tsx', () => ({
    default: () => <div data-testid="mock-loader">Loading...</div>,
}));

vi.mock('@v6y/ui-kit/components/atoms/app/Statistic.tsx', () => ({
    default: ({ value, suffix, valueStyle, prefix }: any) => {
        const MockStatistic = () => {
            const ref = React.useRef<HTMLDivElement>(null);
            React.useEffect(() => {
                if (ref.current && valueStyle) {
                    const styleString = Object.entries(valueStyle).map(([k, v]) => `${k}: ${v};`).join(' ');
                    ref.current.setAttribute('style', styleString);
                }
            }, [valueStyle]);
            return (
                <div ref={ref} data-testid="mock-statistic">
                    {prefix && <span data-testid="mock-statistic-prefix">{prefix}</span>}
                    <span data-testid="mock-statistic-value">{value}</span>
                    {suffix && <span data-testid="mock-statistic-suffix">{suffix}</span>}
                </div>
            );
        };
        return <MockStatistic />;
    },
}));

vi.mock('@v6y/ui-kit-front/components/atoms/input', () => ({
    Input: vi.fn((props) => <input data-testid="mock-search-input" {...props} />),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/button', () => ({
    Button: vi.fn(({ children, onClick, ...others }) => (
        <button {...others} onClick={onClick}>
            {children}
        </button>
    )),
}));

vi.mock('./src/commons/components/VitalitySearchBar', () => ({
    default: ({ placeholder, helper, label }: any) => (
        <div>
            <h3>vitality.dashboardPage.searchByProjectName :</h3>
            <div className="flex items-center space-y-2">
                <div className="flex flex-1 items-center gap-x-2 h-10">
                    <input
                        placeholder={placeholder}
                        aria-label={label}
                        data-testid="mock-search-input"
                        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-400"
                    />
                    <button>search</button>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{helper}</p>
        </div>
    ),
}));

vi.mock('./src/infrastructure/adapters/api/useQueryAdapter', () => {
    return {
        useClientQuery: vi.fn(() => ({
            isLoading: false,
            data: { getApplicationTotalByParams: 0 },
            refetch: vi.fn(),
        })),
        useInfiniteClientQuery: vi.fn(() => ({
            status: 'success',
            data: { pages: [] }, //  Always return a valid object
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        })),
    };
});

vi.mock('./src/commons/utils/VitalityDataExportUtils', () => ({
    exportAppListDataToCSV: vi.fn(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    GlobeIcon: () => React.createElement('div'),
    PlayIcon: () => React.createElement('div'),
    ReloadIcon: () => React.createElement('div'),
    ShuffleIcon: () => React.createElement('div'),
    StarIcon: () => React.createElement('div'),
    Check: () => React.createElement('div'),
}));

// Mock ui-kit-front components
vi.mock('@v6y/ui-kit-front/components/atoms/button', () => ({
    Button: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/input', () => ({
    Input: ({ ...props }: any) => React.createElement('input', props),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/Select', () => ({
    Select: ({ children, ...props }: any) => React.createElement('div', props, children),
    SelectContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    SelectItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    SelectTrigger: ({ children, ...props }: any) => React.createElement('div', { ...props, role: 'combobox' }, children),
    SelectValue: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/Card', () => ({
    Card: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardDescription: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardHeader: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardTitle: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/Form', () => ({
    Form: ({ children, ...props }: any) => React.createElement('form', props, children),
    FormControl: ({ children, ...props }: any) => React.createElement('div', props, children),
    FormField: ({ children, ...props }: any) => React.createElement('div', props, children),
    FormItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    FormLabel: ({ children, ...props }: any) => React.createElement('label', props, children),
    FormMessage: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/sonnerHelpers', () => ({
    toast: vi.fn(),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/avatar', () => ({
    Avatar: ({ children, ...props }: any) => React.createElement('div', props, children),
    AvatarFallback: ({ children, ...props }: any) => React.createElement('div', props, children),
    AvatarImage: ({ children, ...props }: any) => React.createElement('img', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/badge', () => ({
    Badge: ({ children, ...props }: any) => React.createElement('span', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/label', () => ({
    Label: ({ children, ...props }: any) => React.createElement('label', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/skeleton', () => ({
    Skeleton: ({ ...props }: any) => React.createElement('div', props),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/spinner', () => ({
    Spinner: ({ ...props }: any) => React.createElement('div', props),
}));

vi.mock('@v6y/ui-kit-front/components/atoms/textarea', () => ({
    Textarea: ({ ...props }: any) => React.createElement('textarea', props),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/Accordion', () => ({
    Accordion: ({ children, ...props }: any) => React.createElement('div', props, children),
    AccordionContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    AccordionItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    AccordionTrigger: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/Typography', () => ({
    TypographyH1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    TypographyH2: ({ children, ...props }: any) => React.createElement('h2', props, children),
    TypographyH3: ({ children, ...props }: any) => React.createElement('h3', props, children),
    TypographyH4: ({ children, ...props }: any) => React.createElement('h4', props, children),
    TypographyP: ({ children, ...props }: any) => React.createElement('p', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/navigation-menu', () => ({
    NavigationMenu: ({ children, ...props }: any) => React.createElement('nav', props, children),
    NavigationMenuContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    NavigationMenuItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    NavigationMenuLink: ({ children, ...props }: any) => React.createElement('a', props, children),
    NavigationMenuList: ({ children, ...props }: any) => React.createElement('ul', props, children),
    NavigationMenuTrigger: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

vi.mock('@v6y/ui-kit-front/components/molecules/pagination', () => ({
    Pagination: ({ children, ...props }: any) => React.createElement('div', props, children),
    PaginationContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    PaginationEllipsis: ({ children, ...props }: any) => React.createElement('span', props, children),
    PaginationItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    PaginationLink: ({ children, ...props }: any) => React.createElement('a', props, children),
    PaginationNext: ({ children, ...props }: any) => React.createElement('a', props, children),
    PaginationPrevious: ({ children, ...props }: any) => React.createElement('a', props, children),
}));

vi.mock('@v6y/ui-kit/hooks/useThemeConfigProvider.tsx', () => ({
    useThemeConfigProvider: () => ({
        currentConfig: {
            status: {
                success: 'green',
                warning: 'orange',
                error: 'red',
                info: 'blue',
                default: 'black',
            },
            statusIcons: {},
        },
    }),
}));

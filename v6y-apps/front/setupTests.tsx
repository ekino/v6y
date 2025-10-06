/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup } from '@testing-library/react';
import dynamic from 'next/dynamic';
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

// Provide a global mock for next/navigation used by client components in tests.
// This prevents "invariant expected app router to be mounted" errors when
// components call useRouter/useSearchParams/usePathname/redirect during unit tests.
vi.mock('next/navigation', () => {
    const URLSearchParams = globalThis.URLSearchParams;
    return {
        useSearchParams: () => new URLSearchParams(''),
        usePathname: () => '/',
        useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
        redirect: (p: string) => {},
    };
});

// Provide lightweight mocks for @v6y/ui-kit-front primitives used across tests
vi.mock('@v6y/ui-kit-front', async () => {
    const React = await vi.importActual('react');
    return {
        // Provide Input as a component (VitalitySearchBar uses <Input ... />)
        Input: (props: any) => (React as any).createElement('input', { 'data-testid': 'mock-search-input', ...props }),
        // Provide Button as a plain component
        Button: (props: any) => (React as any).createElement('button', { 'data-testid': 'mock-search-button', ...props }, props.children),
    };
});

const formErrors: Record<string, { message: string }> = {}; // Global error state for the mock

beforeEach(() => {
    Object.keys(formErrors).forEach((key) => delete formErrors[key]); // Clear all errors before each test
});

afterEach(() => {
    cleanup();
});

vi.mock('@v6y/ui-kit', () => {
    return {
        useTranslationProvider: vi.fn(() => ({
            translate: (key: string) => key
        })),
        useNavigationAdapter: vi.fn(() => {
            return {
                createUrlQueryParam: vi.fn((key, value) => `${key}=${value}`),
                removeUrlQueryParam: vi.fn(),
                getUrlParams: vi.fn(() => ['']),
                pathname: '/dashboard',
                router: { push: vi.fn(), replace: vi.fn() },
            };
        }),
        useThemeConfigProvider: () => ({
            currentConfig: {
                status: { error: 'red', success: 'green', warning: 'yellow', default: 'gray' },
                statusIcons: { error: '❌', success: '✅', warning: '⚠️', default: 'ℹ️' },
            },
        }),
        useForm: vi.fn(() => ({
            control: {},
            handleSubmit: vi.fn((callback) => () => {
                if (Object.keys(formErrors).length > 0) {
                    return callback(formErrors);
                } else {
                    return callback(); // Executes callback if no errors
                }
            }),
            formState: {
                get errors() {
                    return formErrors;
                },
            },
            clearErrors: (name) => {
                delete formErrors[name];
            },
        })),
        Form: Object.assign(
            ({ children, onFinish }: { children: React.ReactNode; onFinish?: () => void }) => {
                return (
                    <form
                        data-testid="mock-form"
                        onSubmit={(event) => {
                            event.preventDefault(); // Prevent default form behavior
                            if (onFinish) {
                                onFinish(); // Manually trigger form fail submission handler
                            }
                        }}
                    >
                        {children}
                    </form>
                );
            },
            {
                useForm: vi.fn(() => [{ getFieldValue: vi.fn(), setFieldsValue: vi.fn() }]),
                Item: ({
                    children,
                    label,
                    help,
                }: {
                    children: React.ReactNode;
                    label: React.ReactNode;
                    help: React.ReactNode;
                }) => {
                    return (
                        <div data-testid="mock-form-item">
                            {label}
                            {help}
                            {children}
                        </div>
                    );
                },
            },
        ),
        ControlledInput: vi.fn(({ name, 'aria-label': ariaLabel, rules }) => (
            <input
                data-testid={`mock-input-${name}`}
                aria-label={ariaLabel}
                onChange={(e) => {
                    const { value } = e.target;
                    if (rules?.validate) {
                        const validationResult = rules.validate(value);
                        if (validationResult !== true) {
                            formErrors[name] = { message: validationResult };
                        } else {
                            delete formErrors[name];
                        }
                    }
                }}
            />
        )),
        Input: {
            Search: vi.fn(({ placeholder, onSearch }) => (
                <input
                    data-testid="mock-search-input"
                    placeholder={placeholder}
                    onChange={(e) => {
                        onSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            onSearch(e.target.value);
                        }
                    }}
                />
            )),
        },
        Message: {
            useMessage: vi.fn(() => [
                {
                    open: vi.fn(), // Mock the `open` method
                },
                <div key="mock-message-api">Mock Message</div>,
            ]),
        },
        Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Space: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        Card: Object.assign(
            ({
                title,
                actions,
                children,
            }: {
                title: string;
                actions?: React.ReactNode[];
                children: React.ReactNode;
            }) => {
                return (
                    <div data-testid="mock-card">
                        <div data-testid="mock-card-title">{title}</div>
                        <div data-testid="mock-card-content">{children}</div>
                        {actions?.length > 0 && (
                            <div data-testid="mock-card-actions">
                                {actions.map((action, index) => {
                                    return (
                                        <div key={index} data-testid="mock-card-action">
                                            {action}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            },
            {
                Meta: ({ description }: { description: React.ReactNode }) => (
                    <div data-testid="mock-card-meta">{description}</div>
                ),
            },
        ),
        FormOutlined: () => <span data-testid="form-icon" />,
        Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Divider: () => <hr />,
        Statistic: ({
            value,
            suffix,
            valueStyle,
            prefix,
        }: {
            value: number;
            suffix?: string;
            valueStyle?: React.CSSProperties;
            prefix?: React.ReactNode;
        }) => {
            return (
                <div data-testid="mock-statistic" style={valueStyle}>
                    {prefix && <span data-testid="mock-statistic-prefix">{prefix}</span>}
                    <span data-testid="mock-statistic-value">{value}</span>
                    {suffix && <span data-testid="mock-statistic-suffix">{suffix}</span>}
                </div>
            );
        },
        Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Tag: ({ color, children }: { color: string; children: React.ReactNode }) => (
            <span data-testid="tag" style={{ color }}>
                {children}
            </span>
        ),
        Button: ({
            children,
            onClick,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            icon,
            ...others
        }: {
            children: React.ReactNode;
            icon: React.ReactNode;
            onClick: () => void;
        }) => {
            return (
                <button {...others} onClick={onClick}>
                    {children}
                </button>
            );
        },
        ExportOutlined: () => <span>ExportIcon</span>,
        Tabs: ({
            items,
            onChange,
        }: {
            items: Array<{ key: string }>;
            onChange: (key: string) => void;
        }) => (
            <div>
                {items.map((tab) => (
                    <button key={tab.key} onClick={() => onChange(tab.key)}>
                        {tab.key}
                    </button>
                ))}
            </div>
        ),
        Select: ({
            placeholder,
            options = [],
            onChange,
        }: {
            placeholder: string;
            options: any[];
            onChange?: (val: string) => void;
        }) => (
            <select data-testid="mock-select" onChange={(e) => onChange?.(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((option, index) => {
                    return (
                        <option key={index} value={option.value}>
                            {typeof option.label === 'string' ? option.lable : option.value}
                        </option>
                    );
                })}
            </select>
        ),
        Checkbox: Object.assign(
            ({ children }: { children: React.ReactNode }) => (
                <div data-testid="mock-checkbox">{children}</div>
            ),
            {
                Group: ({
                    value,
                    options,
                    onChange,
                }: {
                    value: string[];
                    options: any[];
                    onChange: (values: string[]) => void;
                }) => (
                    <div data-testid="mock-checkbox-group">
                        {options.map((option) => (
                            <label key={option.value}>
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={value.includes(option.value)}
                                    onChange={(e) => {
                                        const newValue = e.target.checked
                                            ? [...value, e.target.value]
                                            : value.filter((v) => v !== e.target.value);
                                        onChange(newValue);
                                    }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                ),
            },
        ),
        Descriptions: Object.assign(
            ({ children }: { children: React.ReactNode }) => (
                <dl data-testid="mock-descriptions">{children}</dl>
            ),
            {
                Item: ({ label, children }: { label: string; children: React.ReactNode }) => {
                    return (
                        <div data-testid="mock-descriptions-item">
                            <dt data-testid="mock-label">{label}</dt>
                            <dd data-testid="mock-value">{children}</dd>
                        </div>
                    );
                },
            },
        ),
        List: Object.assign(
            ({
                dataSource = [],
                renderItem,
                pagination,
                ...props
            }: {
                dataSource: any[];
                renderItem: (item: any, index: number) => React.ReactNode;
                pagination?: { pageSize: number };
            }) => {
                if (!dataSource || dataSource.length === 0) {
                    return <div data-testid="mock-list">No Data Available</div>;
                }

                // Handle pagination if provided
                const paginatedData = pagination
                    ? dataSource.slice(0, pagination.pageSize)
                    : dataSource;

                return (
                    <div data-testid="mock-list" {...props}>
                        {paginatedData.map((item, index) => (
                            <div key={index} data-testid="mock-list-item">
                                {renderItem ? renderItem(item, index) : item || 'No Title'}
                            </div>
                        ))}
                    </div>
                );
            },
            {
                Item: Object.assign(
                    ({ children }: { children: React.ReactNode }) => (
                        <div data-testid="mock-list-item">{children}</div>
                    ),
                    {
                        Meta: ({
                            title,
                            description,
                        }: {
                            title: React.ReactNode;
                            description: React.ReactNode;
                        }) => (
                            <div data-testid="mock-list-meta">
                                <div data-testid="mock-list-meta-title">{title}</div>
                                <div data-testid="mock-list-meta-description">{description}</div>
                            </div>
                        ),
                    },
                ),
            },
        ),
        ListItem: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="mock-list-item">{children}</div>
        ),
        ListItemMeta: ({
            title,
            description,
        }: {
            title: React.ReactNode;
            description: React.ReactNode;
        }) => (
            <div data-testid="mock-list-meta">
                <div data-testid="mock-list-meta-title">{title}</div>
                <div data-testid="mock-list-meta-description">{description}</div>
            </div>
        ),
        NotificationOutlined: () => <div data-testid="notification" />,
        BulbOutlined: () => <div data-testid="bulb" />,
        ProductOutlined: () => <div data-testid="product" />,
        QuestionOutlined: () => <div data-testid="question" />,
        DashboardOutlined: () => <div data-testid="dashboard" />,
        AppstoreAddOutlined: () => <div data-testid="app-store" />,
        SplitCellsOutlined: () => <div data-testid="split-cell" />,
        ApiOutlined: () => <div data-testid="api" />,
        PieChartOutlined: () => <div data-testid="pie-chart" />,
        InfoCircleOutlined: () => <span data-testid="info-cirlce" />,
        InfoOutlined: () => <span data-testid="info" />,
        PushpinOutlined: () => <span data-testid="pushpin" />,
        CompassOutlined: () => <span data-testid="compass" />,
        Modal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
            isOpen ? <div data-testid="mock-modal">{children}</div> : null,
        ModalView: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
            isOpen ? <div data-testid="mock-modal">{children}</div> : null,
        Links: ({ links }: { links: Array<{ label: string; value: string }> }) => (
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.value}>{link.label}</a>
                    </li>
                ))}
            </ul>
        ),
        ControlledCheckbox: vi.fn(({ name, 'aria-label': ariaLabel }) => (
            <input type="checkbox" data-testid={`mock-checkbox-${name}`} aria-label={ariaLabel} />
        )),
        EmptyView: () => <div data-testid="empty-view">No Data Available</div>,
        TextView: ({ content }: { content: string }) => <span>{content}</span>,
        TitleView: ({ title }: { title: string }) => <h3>{title}</h3>,
        LoaderView: () => <div data-testid="mock-loader">Loading...</div>,
        DynamicLoader: (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
            // eslint-disable-next-line react/display-name
            return (props: any) => {
                const LazyComponent = dynamic(() => importFn(), { ssr: false });
                return <LazyComponent {...props} />;
            };
        },
        PaginatedList: ({
            dataSource,
            renderItem,
        }: {
            dataSource: any[];
            renderItem: (item: any) => React.ReactNode;
        }) => {
            if (!dataSource || !Array.isArray(dataSource)) {
                return <div data-testid="mock-paged-list">No Data Available</div>;
            }

            return (
                <div data-testid="mock-paginated-list">
                    <ul className="divide-y divide-border rounded-md border">
                        {dataSource.map((item, index) => (
                            <li key={index} className="p-4">
                                {renderItem(item)}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        },
        LoadMoreList: ({
            dataSource,
            renderItem,
        }: {
            dataSource: any[];
            renderItem: (item: any) => React.ReactNode;
        }) => {
            if (!dataSource || !Array.isArray(dataSource)) {
                return <div data-testid="mock-loadmore-list">No Data Available</div>;
            }

            return (
                <div data-testid="mock-loadmore-list">
                    <ul className="divide-y divide-border rounded-md border">
                        {dataSource.map((item, index) => (
                            <li key={index}>{renderItem(item)}</li>
                        ))}
                    </ul>
                </div>
            );
        },
        CollapseView: vi.fn(({ dataSource }) => (
            <div data-testid="mock-collapse">
                {dataSource?.length ? (
                    dataSource.map((item: any, index: number) => (
                        <div key={index} data-testid="mock-collapse-item">
                            <div data-testid="mock-collapse-label">{item.label}</div>
                            <div data-testid="mock-collapse-content">{item.children}</div>
                        </div>
                    ))
                ) : (
                    <div data-testid="mock-empty-view">No Data Available</div>
                )}
            </div>
        )),
    };
});

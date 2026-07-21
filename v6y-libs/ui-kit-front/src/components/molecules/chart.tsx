import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '../../lib/utils';

type ChartConfig = Record<
    string,
    {
        label?: React.ReactNode;
        color?: string;
    }
>;

type ChartContextProps = {
    config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

const useChart = () => {
    const context = React.useContext(ChartContext);

    if (!context) {
        throw new Error('useChart must be used within a <ChartContainer />');
    }

    return context;
};

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
        config: ChartConfig;
        children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
    }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                ref={ref}
                className={cn(
                    'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-sector_[stroke="#fff"]]:stroke-transparent [&_.recharts-surface]:outline-hidden',
                    className,
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
});
ChartContainer.displayName = 'ChartContainer';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(([, entry]) => entry.color);

    if (!colorConfig.length) {
        return null;
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `
[data-chart="${id}"] {
${colorConfig.map(([key, item]) => `  --color-${key}: ${item.color};`).join('\n')}
}
`,
            }}
        />
    );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
        hideLabel?: boolean;
        hideIndicator?: boolean;
        indicator?: 'line' | 'dot' | 'dashed';
        nameKey?: string;
        labelKey?: string;
    };

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
    (
        {
            active,
            payload,
            className,
            indicator = 'dot',
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref,
    ) => {
        const { config } = useChart();

        const tooltipLabel = React.useMemo(() => {
            if (hideLabel || !payload?.length) {
                return null;
            }

            const [item] = payload;
            const key = `${labelKey || item.dataKey || item.name || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const value =
                !labelKey && typeof label === 'string'
                    ? config[label as keyof typeof config]?.label || label
                    : itemConfig?.label;

            if (labelFormatter) {
                return (
                    <div className={cn('font-medium', labelClassName)}>
                        {labelFormatter(value, payload)}
                    </div>
                );
            }

            if (!value) {
                return null;
            }

            return <div className={cn('font-medium', labelClassName)}>{value}</div>;
        }, [config, hideLabel, label, labelClassName, labelFormatter, labelKey, payload]);

        if (!active || !payload?.length) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
                    className,
                )}
            >
                {tooltipLabel}
                <div className="grid gap-1.5">
                    {payload.map((item, index) => {
                        const key = `${nameKey || item.name || item.dataKey || 'value'}`;
                        const itemConfig = getPayloadConfigFromPayload(config, item, key);
                        const indicatorColor = color || item.payload.fill || item.color;

                        return (
                            <div
                                key={item.dataKey ?? index}
                                className={cn('flex w-full flex-wrap items-stretch gap-2')}
                            >
                                {!hideIndicator && (
                                    <div
                                        className={cn(
                                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                                            {
                                                'h-2.5 w-2.5': indicator === 'dot',
                                                'w-1': indicator === 'line',
                                                'w-0 border-[1.5px] border-dashed bg-transparent':
                                                    indicator === 'dashed',
                                            },
                                        )}
                                        style={
                                            {
                                                '--color-bg': indicatorColor,
                                                '--color-border': indicatorColor,
                                            } as React.CSSProperties
                                        }
                                    />
                                )}
                                <div className="flex flex-1 justify-between leading-none">
                                    <span className="text-muted-foreground">
                                        {itemConfig?.label || item.name}
                                    </span>
                                    {item.value !== undefined && (
                                        <span className="font-mono font-medium text-foreground">
                                            {formatter
                                                ? formatter(
                                                      item.value,
                                                      item.name ?? '',
                                                      item,
                                                      index,
                                                      item.payload,
                                                  )
                                                : item.value.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
    if (typeof payload !== 'object' || payload === null) {
        return undefined;
    }

    const payloadValue = payload as Record<string, unknown>;
    let configLabelKey: string = key;

    if (key in payloadValue && typeof payloadValue[key] === 'string') {
        configLabelKey = payloadValue[key] as string;
    } else if (
        'payload' in payloadValue &&
        typeof payloadValue.payload === 'object' &&
        payloadValue.payload !== null
    ) {
        const nestedPayload = payloadValue.payload as Record<string, unknown>;
        if (key in nestedPayload && typeof nestedPayload[key] === 'string') {
            configLabelKey = nestedPayload[key] as string;
        }
    }

    return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
export type { ChartConfig };

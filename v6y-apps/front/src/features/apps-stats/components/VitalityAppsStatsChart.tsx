import { KeywordStatsType } from '@v6y/core-logic/src/types';
import {
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    TypographyP,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from '@v6y/ui-kit-front';
import * as React from 'react';

const VitalityAppsStatsChart = () => {
    const { translate } = useTranslationProvider();
    const { getUrlParams } = useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    // Fake data for different indicators
    const indicatorData: Record<string, KeywordStatsType[]> = {
        performance: [
            { keyword: { label: 'React' }, total: 45 },
            { keyword: { label: 'TypeScript' }, total: 30 },
            { keyword: { label: 'Node.js' }, total: 20 },
            { keyword: { label: 'Python' }, total: 15 },
            { keyword: { label: 'JavaScript' }, total: 10 },
        ],
        security: [
            { keyword: { label: 'SSL/TLS' }, total: 52 },
            { keyword: { label: 'Authentication' }, total: 38 },
            { keyword: { label: 'Encryption' }, total: 28 },
            { keyword: { label: 'Validation' }, total: 18 },
            { keyword: { label: 'Compliance' }, total: 12 },
        ],
        accessibility: [
            { keyword: { label: 'WCAG 2.1' }, total: 35 },
            { keyword: { label: 'Keyboard Navigation' }, total: 28 },
            { keyword: { label: 'Screen Readers' }, total: 22 },
            { keyword: { label: 'Color Contrast' }, total: 18 },
        ],
        compliance: [
            { keyword: { label: 'GDPR' }, total: 48 },
            { keyword: { label: 'CCPA' }, total: 32 },
            { keyword: { label: 'HIPAA' }, total: 25 },
            { keyword: { label: 'SOC 2' }, total: 19 },
        ],
        maintainability: [
            { keyword: { label: 'Code Coverage' }, total: 60 },
            { keyword: { label: 'Technical Debt' }, total: 40 },
            { keyword: { label: 'Refactoring' }, total: 30 },
            { keyword: { label: 'Documentation' }, total: 25 },
        ],
    };

    const selectedKeywords = keywords?.length ? keywords.split(',') : ['performance', 'security', 'accessibility', 'compliance', 'maintainability'];

    const getDataForIndicators = (indicators: string[]) => {
        if (!indicators.length) return [];
        
        return indicators
            .filter(indicator => indicatorData[indicator] && indicatorData[indicator].length > 0)
            .map((indicator) => ({
                indicator,
                data: indicatorData[indicator] || [],
            }));
    };

    const chartsData = getDataForIndicators(selectedKeywords);

    // Determine best chart type for each indicator
    const getChartType = (indicator: string): 'pie' | 'bar' => {
        const pieChartIndicators = ['performance', 'security', 'accessibility'];
        return pieChartIndicators.includes(indicator) ? 'pie' : 'bar';
    };

    const renderChart = (indicatorData: KeywordStatsType[], indicatorTitle: string) => {
        const dataSourceDisplay = indicatorData.map((item, index) => ({
            label: item.keyword?.label,
            total: item.total,
            fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        }));

        const hasData = dataSourceDisplay && dataSourceDisplay.length > 0;
        const emptyMessage = translate('vitality.appStatsPage.graphEmptyMessage');
        const chartType = getChartType(indicatorTitle);

        const chartConfig: ChartConfig = {
            total: {
                label: translate('vitality.appStatsPage.totalLabel') || 'Total',
            },
        };

        return (
            <div key={indicatorTitle} className="mb-2">
                <Card className="border-slate-200 shadow-sm h-full">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-800">
                            {translate(`vitality.appStatsPage.indicators.${indicatorTitle.toLowerCase()}`) || indicatorTitle}
                        </CardTitle>
                        {hasData && (
                            <TypographyP className="text-sm text-slate-600 mt-1">
                                {`${dataSourceDisplay.length} categor${dataSourceDisplay.length > 1 ? 'ies' : 'y'}`}
                            </TypographyP>
                        )}
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="min-h-[240px] flex items-center justify-center w-full">
                            {hasData ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="w-full h-[220px]"
                                >
                                    {chartType === 'pie' ? (
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Pie
                                                data={dataSourceDisplay}
                                                dataKey="total"
                                                nameKey="label"
                                                innerRadius={50}
                                                strokeWidth={5}
                                                label={({ label }) => label}
                                            >
                                                {dataSourceDisplay.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartLegend
                                                content={<ChartLegendContent nameKey="label" />}
                                                wrapperStyle={{ paddingTop: '10px' }}
                                            />
                                        </PieChart>
                                    ) : (
                                        <BarChart data={dataSourceDisplay} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                            <XAxis
                                                dataKey="label"
                                                stroke="#888888"
                                                style={{ fontSize: '11px' }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                style={{ fontSize: '11px' }}
                                            />
                                            <ChartTooltip
                                                cursor={true}
                                                content={<ChartTooltipContent />}
                                            />
                                            <Bar
                                                dataKey="total"
                                                fill="#3b82f6"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    )}
                                </ChartContainer>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="text-slate-400 text-5xl">📊</div>
                                    <div>
                                        <TypographyP className="text-slate-500 font-medium text-sm">
                                            {emptyMessage}
                                        </TypographyP>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <>
            {chartsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {chartsData.map(({ indicator, data }) => (
                        <div key={indicator}>
                            {renderChart(data, indicator)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-slate-800">
                                {translate('vitality.appStatsPage.graphTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="min-h-[400px] flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="text-slate-400 text-6xl">📊</div>
                                    <div>
                                        <TypographyP className="text-slate-500 font-medium">
                                            {translate('vitality.appStatsPage.graphEmptyMessage')}
                                        </TypographyP>
                                        <TypographyP className="text-slate-400 text-sm mt-2">
                                            {translate('vitality.appStatsPage.selectIndicatorsMessage')}
                                        </TypographyP>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default VitalityAppsStatsChart;

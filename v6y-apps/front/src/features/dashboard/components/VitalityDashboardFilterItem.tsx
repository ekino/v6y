import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v6y/ui-kit-front';

import { type DashboardItemType } from '../../../commons/config/VitalityCommonConfig';

interface VitalityDashboardFilterItemProps {
    option: DashboardItemType | null;
}

const VitalityDashboardFilterItem: React.FC<VitalityDashboardFilterItemProps> = ({ option }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url}>
            <Card className="cursor-pointer p-2 md:p-3 lg:p-4 border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-y-0 pb-1">
                    <div
                        className="flex h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full text-xs md:text-sm lg:text-lg"
                        style={{
                            backgroundColor: `${option.avatarColor}1A`,
                            color: option.avatarColor,
                        }}
                    >
                        {option.avatar}
                    </div>
                    <div className="ml-2 md:ml-3 flex-1">
                        <CardTitle className="text-xs md:text-sm lg:text-base leading-tight">
                            {option.title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-1">
                    <CardDescription className="text-xs md:text-xs lg:text-xs line-clamp-2">
                        {option.description}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
};

export default VitalityDashboardFilterItem;

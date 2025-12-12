import Link from 'next/link';

import {
    Avatar,
    AvatarFallback,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@v6y/ui-kit-front';

interface VitalityDashboardFilterItemProps {
    option: {
        url: string;
        avatar: React.ReactNode;
        avatarColor: string;
        title: string;
        description: string;
    } | null;
}

const VitalityDashboardFilterItem: React.FC<VitalityDashboardFilterItemProps> = ({ option }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url}>
            <Card className="cursor-pointer p-3 border-slate-200">
                <CardHeader className="flex flex-row items-center space-y-0 pb-1">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-lg">{option.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1">
                        <CardTitle className="text-base leading-tight">{option.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-1">
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
};

export default VitalityDashboardFilterItem;

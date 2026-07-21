const VitalityDetailsPageSkeleton = () => {
    return (
        <div className="min-h-screen mt-4 md:px-6 lg:px-0" data-testid="app-details-skeleton">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 animate-pulse">
                <div className="lg:col-span-3 w-full">
                    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
                        <div className="h-6 w-2/3 rounded bg-slate-200" />
                        <div className="h-4 w-1/2 rounded bg-slate-100" />
                        <div className="h-4 w-3/4 rounded bg-slate-100" />
                        <div className="h-20 w-full rounded bg-slate-100" />
                    </div>
                </div>

                <div className="lg:col-span-9 w-full space-y-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                            <div className="h-9 w-44 rounded bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-24 rounded bg-slate-100" />
                                <div className="h-9 w-24 rounded bg-slate-100" />
                                <div className="h-9 w-32 rounded bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-sm">
                        <div className="h-5 w-40 rounded bg-slate-200" />
                        <div className="h-4 w-2/3 rounded bg-slate-100" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="h-16 rounded bg-slate-100" />
                            <div className="h-16 rounded bg-slate-100" />
                            <div className="h-16 rounded bg-slate-100" />
                            <div className="h-16 rounded bg-slate-100" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-sm">
                        <div className="h-4 w-48 rounded bg-slate-200" />
                        <div className="h-10 rounded bg-slate-100" />
                        <div className="h-10 rounded bg-slate-100" />
                        <div className="h-10 rounded bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VitalityDetailsPageSkeleton;

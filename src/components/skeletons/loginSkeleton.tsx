export function SkeletonForm() {
    return (
        <div className="animate-pulse space-y-6 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-xl p-6 shadow-sm w-[400px] max-w-full mx-auto">
            <div className="h-6 bg-[var(--bgLevel1)] rounded w-3/4 mx-auto" />
            <div className="h-4 bg-[var(--bgLevel1)] rounded w-2/3 mx-auto mb-2" />
            <div className="space-y-4">
                <div className="h-10 bg-[var(--bgLevel1)] rounded" />
                <div className="h-10 bg-[var(--bgLevel1)] rounded" />
            </div>
            <div className="h-10 bg-[var(--pink20)] rounded opacity-60" />
            <div className="h-4 bg-[var(--bgLevel1)] rounded w-1/2 mx-auto" />
        </div>
    );
}
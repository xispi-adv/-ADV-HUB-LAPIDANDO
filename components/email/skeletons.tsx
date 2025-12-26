import React from 'react';

const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`bg-white/10 rounded animate-pulse ${width} ${height}`}></div>
);

export const EmailListSkeleton: React.FC = () => (
    <div className="p-4 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                    <SkeletonLine width="w-1/3" height="h-5" />
                    <SkeletonLine width="w-1/6" height="h-3" />
                </div>
                <SkeletonLine width="w-3/4" height="h-4" />
                <SkeletonLine width="w-full" height="h-4" />
            </div>
        ))}
    </div>
);

export const EmailViewSkeleton: React.FC = () => (
    <div className="p-4 h-full">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
            <div className="flex-grow space-y-2">
                <SkeletonLine width="w-1/4" />
                <SkeletonLine width="w-1/2" height="h-3" />
            </div>
        </div>
        <div className="space-y-3">
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine width="w-5/6" />
            <br/>
            <SkeletonLine width="w-3/4" />
            <SkeletonLine width="w-full" />
        </div>
    </div>
);

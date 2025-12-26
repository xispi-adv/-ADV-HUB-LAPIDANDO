
import React from 'react';

const SystemStatusRow: React.FC<{ label: string, status: string, color: string }> = ({ label, status, color }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
        <span className="text-white/50 font-mono text-sm uppercase tracking-wider">{label}</span>
        <span className={`font-mono text-sm ${color} animate-pulse`}>{status}</span>
    </div>
);

const SupportView: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="max-w-md w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                    </div>
                </div>
                
                <h2 className="text-2xl font-light text-center text-white mb-2">System Status</h2>
                <p className="text-white/40 text-center text-sm mb-8">AI Playground Modules</p>

                <div className="space-y-1">
                    <SystemStatusRow label="Image Engine" status="OPERATIONAL" color="text-green-500" />
                    <SystemStatusRow label="Video Engine" status="OPERATIONAL" color="text-green-500" />
                    <SystemStatusRow label="API Latency" status="42ms" color="text-blue-400" />
                    <SystemStatusRow label="GPU Load" status="34%" color="text-yellow-500" />
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <button className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest border border-white/10 hover:border-white/30 px-4 py-2 rounded-full">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportView;

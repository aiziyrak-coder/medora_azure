import React from 'react';
import type { UserStats } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface UserStatsProps { stats: UserStats }

const RadialRing: React.FC<{
    value: number; max?: number;
    label: string; sublabel: string;
    color: string; trackColor: string; size?: number;
}> = ({ value, max = 100, label, sublabel, color, trackColor, size = 84 }) => {
    const r    = 30;
    const circ = 2 * Math.PI * r;
    const pct  = Math.min(value / max, 1);
    const off  = circ * (1 - pct);
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="0 0 72 72" width={size} height={size} className="rotate-[-90deg]">
                    <circle cx="36" cy="36" r={r} fill="none" stroke={trackColor} strokeWidth="6" />
                    <circle
                        cx="36" cy="36" r={r} fill="none"
                        stroke={color} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={pct === 0 ? circ * 0.97 : off}
                        style={{ filter:`drop-shadow(0 0 5px ${color})`, transition:'stroke-dashoffset 1.4s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-black" style={{ color }}>{label}</span>
                </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-center text-slate-500">{sublabel}</p>
        </div>
    );
};

const UserStatsComponent: React.FC<UserStatsProps> = ({ stats }) => {
    const { t } = useTranslation();
    const acc   = Math.round(stats.feedbackAccuracy * 100);
    const maxD  = Math.max(...stats.commonDiagnoses.map(d => d.count), 1);
    const barColors  = ['#0891b2', '#059669', '#7c3aed'];
    const barGlows   = ['rgba(8,145,178,0.4)', 'rgba(5,150,105,0.4)', 'rgba(124,58,237,0.4)'];

    const glass: React.CSSProperties = {
        background: 'rgba(255,255,255,0.62)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.75)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset',
    };

    return (
        <div className="rounded-[22px] p-5 h-full flex flex-col gap-4" style={{ ...glass, minHeight:'230px' }}>
            <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full"
                     style={{ background:'linear-gradient(180deg,#0891b2,#059669)' }} />
                <h2 className="text-sm font-bold text-slate-700 tracking-wide">{t('dashboard_stats_title')}</h2>
            </div>

            {/* Rings */}
            <div className="flex items-center justify-around py-1">
                <RadialRing
                    value={Math.min(stats.totalAnalyses,100)} max={100}
                    label={String(stats.totalAnalyses)} sublabel={t('stats_total_analyses')}
                    color="#059669" trackColor="rgba(5,150,105,0.12)"
                />
                <div className="w-px h-14 bg-slate-100" />
                <RadialRing
                    value={acc} max={100}
                    label={`${acc}%`} sublabel={t('stats_feedback_accuracy')}
                    color="#0891b2" trackColor="rgba(8,145,178,0.12)"
                />
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Top diagnoses */}
            <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    {t('stats_top_diagnoses')}
                </p>
                <div className="space-y-2.5">
                    {stats.commonDiagnoses.length > 0
                        ? stats.commonDiagnoses.map((d, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-xs font-semibold text-slate-700 truncate pr-2">{d.name}</p>
                                    <span className="text-[10px] font-mono font-bold flex-shrink-0"
                                          style={{ color: barColors[i % barColors.length] }}>
                                        {d.count}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
                                    <div className="h-full rounded-full"
                                         style={{
                                             width:`${(d.count/maxD)*100}%`,
                                             background: barColors[i%barColors.length],
                                             boxShadow:`0 0 6px ${barGlows[i%barGlows.length]}`,
                                             transition:'width 1.2s ease',
                                         }} />
                                </div>
                            </div>
                        ))
                        : (
                            <div className="text-center py-5 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                                <p className="text-xs font-medium text-slate-400">{t('stats_no_data')}</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default UserStatsComponent;

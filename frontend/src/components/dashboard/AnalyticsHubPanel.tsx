import React from 'react';
import type { AnalysisRecord, UserStats } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.75)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset',
};

interface AnalyticsHubPanelProps {
    stats: UserStats | null;
    allAnalyses: AnalysisRecord[];
}

const AnalyticsHubPanel: React.FC<AnalyticsHubPanelProps> = ({ stats, allAnalyses }) => {
    const { t } = useTranslation();

    const barColors = ['#0891b2', '#059669', '#7c3aed', '#ea580c', '#db2777', '#0e7490', '#047857', '#6d28d9'];
    const barGlows = [
        'rgba(8,145,178,0.35)', 'rgba(5,150,105,0.35)', 'rgba(124,58,237,0.35)', 'rgba(234,88,12,0.35)',
        'rgba(219,39,119,0.35)', 'rgba(14,116,144,0.35)', 'rgba(4,120,87,0.35)', 'rgba(109,40,217,0.35)',
    ];

    if (!stats) {
        return (
            <div
                className="rounded-[22px] p-8 h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-4"
                style={glass}
            >
                <div
                    className="w-12 h-12 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(8,145,178,0.2)', borderTopColor: '#0891b2' }}
                />
                <p className="text-sm font-semibold text-slate-500">{t('dashboard_stats_loading')}</p>
            </div>
        );
    }

    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const inLast = (days: number) =>
        allAnalyses.filter(a => {
            const dt = new Date(a.date);
            if (Number.isNaN(dt.getTime())) return false;
            return (now.getTime() - dt.getTime()) / msInDay <= days;
        }).length;

    const sc = stats.serverCounts;
    const today = sc ? sc.last24h : inLast(1);
    const week = sc ? sc.last7d : inLast(7);
    const month = sc ? sc.last30d : inLast(30);
    const total = stats.totalAnalyses;
    const acc = Math.round(stats.feedbackAccuracy * 100);
    const maxDiag = Math.max(...stats.commonDiagnoses.map(d => d.count), 1);

    const avgWeek = week > 0 ? (week / 7).toFixed(1) : '—';
    const avgMonth = month > 0 ? (month / 30).toFixed(1) : '—';

    return (
        <div
            className="rounded-[22px] p-5 md:p-6 flex flex-col gap-4 min-h-[300px] lg:min-h-[320px] max-h-[min(85vh,720px)]"
            style={glass}
        >
            <div className="flex flex-col gap-1 shrink-0">
                <div className="flex items-center gap-2">
                    <div
                        className="w-1 h-5 rounded-full shrink-0"
                        style={{ background: 'linear-gradient(180deg,#6366f1,#0891b2)' }}
                    />
                    <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                        {t('dashboard_analytics_title') || 'Analitika Hub'}
                    </h2>
                </div>
                <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed pl-3 border-l-2 border-sky-100">
                    {t('dashboard_analytics_subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 md:gap-3 shrink-0">
                <div className="rounded-xl px-3 py-3 md:py-3.5 bg-sky-50 border border-sky-100/80">
                    <p className="text-[9px] md:text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                        {t('stats_range_day') || 'Bugun'}
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-black text-sky-800 tabular-nums leading-none">{today}</p>
                    <p className="text-[9px] text-slate-500 mt-1">{t('stats_total_analyses')}</p>
                </div>
                <div className="rounded-xl px-3 py-3 md:py-3.5 bg-emerald-50 border border-emerald-100/80">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                        {t('stats_range_week') || '7 kun'}
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-black text-emerald-800 tabular-nums leading-none">{week}</p>
                    <p className="text-[9px] text-slate-500 mt-1">{t('stats_total_analyses')}</p>
                </div>
                <div className="rounded-xl px-3 py-3 md:py-3.5 bg-indigo-50 border border-indigo-100/80">
                    <p className="text-[9px] md:text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                        {t('stats_range_month') || '30 kun'}
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-black text-indigo-900 tabular-nums leading-none">{month}</p>
                    <p className="text-[9px] text-slate-500 mt-1">{t('stats_total_analyses')}</p>
                </div>
                <div className="rounded-xl px-3 py-3 md:py-3.5 bg-slate-900 text-white border border-slate-800">
                    <p className="text-[9px] md:text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
                        {t('stats_range_all') || 'Umumiy'}
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-black tabular-nums leading-none">{total}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{t('stats_total_analyses')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 shrink-0">
                <div className="rounded-lg px-2.5 py-2 bg-white/70 border border-slate-100">
                    <span className="font-semibold text-slate-500">{t('dashboard_analytics_avg_week')}</span>
                    <span className="float-right font-mono font-bold text-sky-700">{avgWeek}</span>
                </div>
                <div className="rounded-lg px-2.5 py-2 bg-white/70 border border-slate-100">
                    <span className="font-semibold text-slate-500">{t('dashboard_analytics_avg_month')}</span>
                    <span className="float-right font-mono font-bold text-emerald-700">{avgMonth}</span>
                </div>
            </div>

            <div
                className="rounded-xl px-3 py-3 flex items-center justify-between gap-3 border border-slate-100 bg-gradient-to-r from-sky-50/80 to-emerald-50/50 shrink-0"
            >
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        {t('stats_feedback_accuracy')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{t('dashboard_analytics_feedback_hint')}</p>
                </div>
                <p className="text-3xl font-black text-sky-700 tabular-nums">{acc}%</p>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
                    {t('dashboard_analytics_diagnoses_heading')}
                </p>
                <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-[120px] max-h-[240px]">
                    {stats.commonDiagnoses.length > 0 ? (
                        stats.commonDiagnoses.map((d, i) => (
                            <div key={`${d.name}-${i}`}>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2 flex-1">
                                        {d.name}
                                    </p>
                                    <span
                                        className="text-[10px] font-mono font-bold shrink-0 pt-0.5"
                                        style={{ color: barColors[i % barColors.length] }}
                                    >
                                        {d.count}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(d.count / maxDiag) * 100}%`,
                                            background: barColors[i % barColors.length],
                                            boxShadow: `0 0 6px ${barGlows[i % barGlows.length]}`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                            <p className="text-xs font-medium text-slate-400">{t('stats_no_data')}</p>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[9px] text-slate-400 leading-snug border-t border-slate-100 pt-3 shrink-0">
                {t('dashboard_analytics_source_note')}
            </p>
        </div>
    );
};

export default AnalyticsHubPanel;

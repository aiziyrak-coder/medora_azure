import React from 'react';
import type { CMETopic } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CmeSuggestionsProps { topics: CMETopic[] }

const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.75)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset',
};

const CmeSuggestions: React.FC<CmeSuggestionsProps> = ({ topics }) => {
    const { t } = useTranslation();

    if (!topics || topics.length === 0) {
        return (
            <div className="rounded-[20px] p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[160px]"
                 style={glass}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                     style={{ background:'rgba(237,233,254,0.8)', border:'1px solid rgba(124,58,237,0.2)', color:'#7c3aed' }}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">{t('cme_recommendations_info')}</p>
                    <p className="text-xs text-slate-400">{t('cme_recommendations_subtitle')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[20px] overflow-hidden" style={glass}>
            <div className="divide-y divide-slate-100">
                {topics.map((item, i) => (
                    <div
                        key={i}
                        className="px-5 py-4 transition-all duration-200 hover:bg-white/70 cursor-default"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                                 style={{ background:'rgba(237,233,254,0.8)', color:'#7c3aed', border:'1px solid rgba(124,58,237,0.2)' }}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded text-violet-600 tracking-widest uppercase"
                                          style={{ background:'rgba(237,233,254,0.9)', border:'1px solid rgba(124,58,237,0.25)' }}>
                                        AI
                                    </span>
                                    <p className="text-xs font-semibold text-slate-700 leading-snug">{item.topic}</p>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{item.relevance}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CmeSuggestions;

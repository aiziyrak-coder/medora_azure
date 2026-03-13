import React from 'react';
import type { AnalysisRecord, ChatMessage } from '../types';
import { generatePdfReport } from '../services/pdfGenerator';
import { generateDocxReport } from '../services/docxGenerator';
import DownloadIcon from './icons/DownloadIcon';
import { AI_SPECIALISTS } from '../constants';

interface DownloadPanelProps {
    record: Partial<AnalysisRecord>;
}

/** Plain text file downloader */
function downloadTxt(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const DownloadPanel: React.FC<DownloadPanelProps> = ({ record }) => {
    if (!record.finalReport || !record.patientData) {
        return null;
    }

    const debateHistory: ChatMessage[] = Array.isArray(record.debateHistory) ? record.debateHistory : [];
    const patientName = `${record.patientData.lastName || ''}_${record.patientData.firstName || ''}`.replace(/\s+/g, '_') || 'Bemor';

    // Group last message per specialist
    const specialistLastMsg = new Map<string, ChatMessage>();
    debateHistory
        .filter(m => !m.isSystemMessage && !m.isUserIntervention)
        .forEach(m => specialistLastMsg.set(m.author, m));

    const handlePdfDownload = () => {
        generatePdfReport(record.finalReport!, record.patientData!, debateHistory);
    };

    const handleDocxDownload = async () => {
        await generateDocxReport(record.finalReport!, record.patientData!, debateHistory);
    };

    const handleSpecialistTxt = (author: string, content: string) => {
        const name = (AI_SPECIALISTS[author]?.name || author).replace(/\s+/g, '_');
        downloadTxt(`${patientName}_${name}_xulosa.txt`, content);
    };

    return (
        <div className="space-y-4">
            {/* Umumiy hisobot */}
            <div className="p-4 bg-slate-100 rounded-xl border border-border-color">
                <h4 className="font-bold text-text-primary mb-3">Umumiy konsilium hisobotini yuklab olish</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handlePdfDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>PDF yuklab olish</span>
                    </button>
                    <button
                        onClick={handleDocxDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Word yuklab olish</span>
                    </button>
                </div>
            </div>

            {/* Har bir mutaxassis yakuniy xulosasi */}
            {specialistLastMsg.size > 0 && (
                <div className="p-4 bg-slate-100 rounded-xl border border-border-color">
                    <h4 className="font-bold text-text-primary mb-3">Har bir mutaxassisning yakuniy xulosasi</h4>
                    <div className="space-y-2">
                        {Array.from(specialistLastMsg.entries()).map(([author, msg]) => {
                            const specName = AI_SPECIALISTS[author]?.name || author;
                            const specTitle = AI_SPECIALISTS[author]?.title || '';
                            return (
                                <button
                                    key={author}
                                    onClick={() => handleSpecialistTxt(author, msg.content)}
                                    className="w-full flex items-center justify-between gap-2 py-2 px-3 text-sm bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                                >
                                    <span className="text-left">
                                        <span className="font-semibold text-text-primary">{specName}</span>
                                        {specTitle && <span className="text-xs text-slate-500 ml-1">({specTitle})</span>}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500 shrink-0">
                                        <DownloadIcon className="w-4 h-4" />
                                        <span className="text-xs">.txt</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadPanel;

import { Document, DocumentDefaults, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import type { FinalReport, PatientData, ChatMessage } from '../types';
import { normalizeConsensusDiagnosis } from '../types';
import { AI_SPECIALISTS } from '../constants';
import { logger } from '../utils/logger';
import type { InstituteBranding } from './pdfGenerator';

// Helper functions to create document elements
const createHeading1 = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
const createHeading2 = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
const createKeyValue = (key: string, value: string | undefined | null) => new Paragraph({
    children: [
        new TextRun({ text: `${key}: `, bold: true }),
        new TextRun(value || "N/A"),
    ],
    spacing: { after: 100 }
});
const createListItem = (text: string) => new Paragraph({ text, bullet: { level: 0 } });

export type SpecialistNameResolver = (author: string) => string;

/** Decode data URL to Uint8Array for docx ImageRun */
function dataUrlToArrayBuffer(dataUrl: string): Uint8Array {
    const base64 = dataUrl.includes('base64,') ? dataUrl.split(',')[1] : dataUrl;
    if (!base64) return new Uint8Array(0);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export const generateDocxReport = async (
    report: FinalReport,
    patientData: PatientData,
    debateHistory: ChatMessage[],
    getSpecialistName?: SpecialistNameResolver,
    branding?: InstituteBranding
) => {
    const specialistName = (author: string) => getSpecialistName ? getSpecialistName(author) : (AI_SPECIALISTS[author]?.name || author);
    const stripSalutation = (text: string) =>
        text.replace(/^\s*Hurmatli\s+Kengash\s+Raisi\s*,?\s*/i, '').trim();

    const children: Paragraph[] = [];

    if (branding?.instituteName || branding?.instituteLogoDataUrl) {
        if (branding.instituteLogoDataUrl) {
            try {
                const imageData = dataUrlToArrayBuffer(branding.instituteLogoDataUrl);
                if (imageData.length > 0) {
                    children.push(new Paragraph({
                        children: [
                            new ImageRun({
                                data: imageData,
                                transformation: { width: 120, height: 120 },
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }));
                }
            } catch {
                // ignore image errors
            }
        }
        if (branding.instituteName) {
            children.push(new Paragraph({
                children: [new TextRun({ text: branding.instituteName, bold: true, size: 24 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }));
        }
        children.push(new Paragraph({ text: "" }));
    }

    const reportDate = new Date();
    const dateStr = reportDate.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

    children.push(
        new Paragraph({
            text: "KONSILIUM: Yakuniy Klinik Xulosa",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: "Rasmiy tibbiy maslahat hujjati. Hisobot sanasi: " + dateStr, italics: true, size: 20 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }),
        new Paragraph({ text: "\n" }),

        createHeading1("Bemor Ma'lumotlari"),
        createKeyValue("Bemor", `${patientData.firstName} ${patientData.lastName}`),
        createKeyValue("Yoshi", patientData.age),
        createKeyValue("Jinsi", patientData.gender === 'male' ? 'Erkak' : patientData.gender === 'female' ? 'Ayol' : 'Boshqa'),
        createKeyValue("Shikoyatlar va Anamnez", patientData.complaints),
        createKeyValue("Kasallik Tarixi", patientData.history),
        createKeyValue("Ob'ektiv Ko'rik", patientData.objectiveData),
        createKeyValue("Laborator Tahlillar", patientData.labResults),

        ...(report.criticalFinding && report.criticalFinding.finding ? [
            createHeading1("Muhim topilma (shoshilinch)"),
            createKeyValue("Topilma", report.criticalFinding.finding),
            createKeyValue("Oqibat", report.criticalFinding.implication),
            createKeyValue("Shoshilinchlik", report.criticalFinding.urgency),
            new Paragraph({ text: "" }),
        ] : []),

        createHeading1("Konsilium Konsensusi"),
        createHeading2("Eng Ehtimolli Tashxis(lar)"),
        ...normalizeConsensusDiagnosis(report.consensusDiagnosis).flatMap(diag => [
            createKeyValue("Tashxis", `${diag.name} (${diag.probability}%)`),
            createKeyValue("Dalillilik Darajasi", diag.evidenceLevel || "N/A"),
            createKeyValue("Asoslash", diag.justification),
            new Paragraph({ text: "" }),
        ]),

        createHeading2("Tavsiya Etilgan Davolash Rejasi"),
        ...(Array.isArray(report.treatmentPlan) ? report.treatmentPlan : []).map((step: unknown) =>
            createListItem(typeof step === 'string' ? step : (step && typeof step === 'object' ? [(step as Record<string, unknown>).step, (step as Record<string, unknown>).details, (step as Record<string, unknown>).text].filter(Boolean).map(String).join(' - ') || JSON.stringify(step) : String(step ?? '')))
        ),
        new Paragraph({ text: "" }),

        createHeading2("Dori-Darmonlar bo'yicha Tavsiyalar"),
        ...report.medicationRecommendations.flatMap(med => [
            createKeyValue("Nomi", med.name),
            createKeyValue("Doza", med.dosage),
            createKeyValue("Izoh", med.notes),
            new Paragraph({ text: "" }),
        ]),

        createHeading2("Tavsiya Etiladigan Qo'shimcha Tekshiruvlar"),
        ...(Array.isArray(report.recommendedTests) ? report.recommendedTests : []).map((test: unknown) => {
            const str = typeof test === 'string' ? test : (test && typeof test === 'object'
                ? [(test as Record<string, unknown>).testName ?? (test as Record<string, unknown>).name, (test as Record<string, unknown>).reason, (test as Record<string, unknown>).urgency].filter(Boolean).map(String).join(' - ') || JSON.stringify(test)
                : String(test ?? ''));
            return createListItem(str);
        }),
        new Paragraph({ text: "" }),
        
        createHeading2("Inkor Etilgan Gipotezalar"),
         ...report.rejectedHypotheses.flatMap(hyp => [
            createKeyValue("Gipoteza", hyp.name),
            createKeyValue("Rad etish sababi", hyp.reason),
            new Paragraph({ text: "" }),
        ]),

        ...(report.uzbekistanLegislativeNote ? [
            createHeading2("Qonuniy eslatma"),
            new Paragraph({ children: [new TextRun(report.uzbekistanLegislativeNote)], spacing: { after: 200 } }),
        ] : []),

        createHeading1("Har bir mutaxassisning yakuniy shaxsiy xulosasi"),
        ...((): Paragraph[] => {
            const specialistMessages = debateHistory.filter(m => !m.isSystemMessage && !m.isUserIntervention);
            const lastByAuthor = new Map<string, ChatMessage>();
            specialistMessages.forEach(m => lastByAuthor.set(m.author, m));
            return Array.from(lastByAuthor.entries()).map(([author, msg]) => new Paragraph({
                children: [
                    new TextRun({ text: `${specialistName(author)}: `, bold: true }),
                    new TextRun(stripSalutation(String(msg.content || ''))),
                ],
                spacing: { after: 200 },
            }));
        })(),
        new Paragraph({ text: "" }),

        createHeading1("Konsilium Munozara Tarixi"),
        ...debateHistory.filter(msg => !msg.isSystemMessage && !msg.isUserIntervention).map(msg => new Paragraph({
            children: [
                new TextRun({ text: `${msg.author ? specialistName(msg.author) : 'Foydalanuvchi'}: `, bold: true }),
                new TextRun(stripSalutation(String(msg.content || '')))
            ],
            spacing: { after: 200 }
        })),
    );
    
    const doc = new Document({
        styles: {
            default: new DocumentDefaults({
                run: { font: 'Times New Roman', size: 22 },
                paragraph: { spacing: { after: 160, line: 276 } },
            }),
        },
        sections: [{ children }],
    });

    try {
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Tibbiy_Xulosa_${patientData.lastName}_${patientData.firstName}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        // DOCX generation error
        logger.error("Could not generate DOCX file.", e);
        alert("DOCX faylini yaratishda xatolik yuz berdi.");
    }
};
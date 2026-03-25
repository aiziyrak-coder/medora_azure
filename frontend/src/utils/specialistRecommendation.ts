/**
 * Shikoyat/kasallik matniga asoslangan tezkor mutaxassis taklifi (AI kutishsiz).
 * Kasallikdan kelib chiqib 6–10 ta tegishli mutaxassis tanlanadi; har xil holatlar uchun har xil jamoa.
 */

import { AIModel } from '../constants/specialists';

/** Shikoyat kalit so'zlari -> mutaxassis(lar) — kengaytirilgan ro'yxat, kasallik bo'yicha farq qiladi */
const KEYWORD_TO_SPECIALISTS: { keywords: RegExp; models: AIModel[] }[] = [
  // Yurak-qon tomir
  { keywords: /\b(yurak|qon\s*bosimi|puls|aritmiya|stenokardiya|infarkt|kardiolog|gipertoniya|gipotoniya|blokada|tachycardia|bradikardiya)\b/i, models: [AIModel.GEMINI] },
  // Nerv tizimi
  { keywords: /\b(bosh\s*og'riq|bosh\s*ogriq|nevrolog|falaj|paralich|epilepsiya|stroke|migren|bell\s*palsy|yuz\s*falaj|miasteniya|parkinson)\b/i, models: [AIModel.CLAUDE] },
  // Radiologiya / tasvir
  { keywords: /\b(rentgen|röntgen|ct|mrt|mri|tasvir|radiolog|skaner|ushlash)\b/i, models: [AIModel.GPT] },
  // Onkologiya
  { keywords: /\b(o'sma|saraton|onkolog|metastaz|karcinoma|tumor|o'sma)\b/i, models: [AIModel.LLAMA] },
  // Endokrin
  { keywords: /\b(qand|gormon|qalqonsimon|tiroid|endokrin|diabet|giperglikemiya|gipoglikemiya|insulin)\b/i, models: [AIModel.GROK] },
  // Nafas o'pka
  { keywords: /\b(nafas|o'pka|bronx|pnevmoniya|astma|spo2|bronxit|tuberkulez|sil|o'pka\s*kasallik)\b/i, models: [AIModel.PULMONOLOGIST] },
  { keywords: /\b(sil|ftiziatr|tuberkulez)\b/i, models: [AIModel.PHTHISIATRICIAN] },
  // Ovqat hazm, jigar
  { keywords: /\b(jigar|oshqozon|ichak|gastrit|gepatit|pankreas|cirroz|o't\s*pufak|dispepsiya|reflyuks)\b/i, models: [AIModel.GASTRO] },
  { keywords: /\b(jigar\s*sirrozi|gepatit\s*c|jigar\s*yetishmovchilik)\b/i, models: [AIModel.HEPATOLOGIST] },
  // Buyrak
  { keywords: /\b(buyrak|siydik|nefrit|dializ|kreatinin|uremiya|piyelonefrit)\b/i, models: [AIModel.NEPHROLOGIST] },
  // Urologiya
  { keywords: /\b(siydik\s*yo'li|urolog|prostat|tsistit|bovak|erektil)\b/i, models: [AIModel.UROLOGIST] },
  // Teri
  { keywords: /\b(teri|dermato|qichima|ekzema|psoriaz|dermatit|qotish)\b/i, models: [AIModel.DERMATOLOGIST] },
  // Allergiya
  { keywords: /\b(allergiya|reaksiya|qichish|antigen|anafilaksiya)\b/i, models: [AIModel.ALLERGIST] },
  // Ortopediya, suyak, bo'yin
  { keywords: /\b(suyak|tizza|bo'yin|bel|ortoped|artroz|artrit|shish\s*tizza|burilish|sinish|vertebra|umurtqa)\b/i, models: [AIModel.ORTHOPEDIC] },
  { keywords: /\b(vertebra|umurtqa|bel\s*og'riq|disk\s*herniya)\b/i, models: [AIModel.VERTEBROLOGIST] },
  // Ko'z
  { keywords: /\b(ko'z|retina|glaukoma|katarakta|kon'yunktivit|ko'rish)\b/i, models: [AIModel.OPHTHALMOLOGIST] },
  // LOR
  { keywords: /\b(quloq|tomoq|burun|lor|tonzillit|otit|sinusit|labirintit|eshitish)\b/i, models: [AIModel.OTOLARYNGOLOGIST] },
  // Ruhiyat
  { keywords: /\b(psix|depressiya|ruhiy|stress|anksiyete|shizofreniya|bipolyar)\b/i, models: [AIModel.PSYCHIATRIST] },
  // Obstetrika, pediatriya
  { keywords: /\b(homilador|tug'ruq|obstetr|bachadon|qisqa\s*muddat)\b/i, models: [AIModel.OBGYN] },
  { keywords: /\b(bola|chaqaloq|pediatr|bola\s*kasallik|yosh\s*bemor)\b/i, models: [AIModel.PEDIATRICIAN] },
  // Farmakologiya
  { keywords: /\b(dori|darmon|doza|aralashuv|nojo'ya\s*ta'sir)\b/i, models: [AIModel.PHARMACOLOGIST] },
  // Shoshilinch
  { keywords: /\b(shoshilinch|jiddiy|urgent|krizis|reanimatsiya)\b/i, models: [AIModel.EMERGENCY] },
  // Yuqumli
  { keywords: /\b(yuqumli|infeksiya|virus|bakteriya|COVID|sepsis|issiqlik\s*isitma)\b/i, models: [AIModel.INFECTIOUS] },
  // Revmatologiya
  { keywords: /\b(revmatik|bo'g'im|lyupus|revmatoid|artrit|kollagenoz)\b/i, models: [AIModel.RHEUMATOLOGIST] },
  // Qon
  { keywords: /\b(qon|anemiya|leykemiya|gemoglobin|trombosit|koagulopatiya)\b/i, models: [AIModel.HEMATOLOGIST] },
  // Immunologiya
  { keywords: /\b(immun|autoimmun|immunitet|vaksina)\b/i, models: [AIModel.IMMUNOLOGIST] },
  // Jarrohlik
  { keywords: /\b(appenditsit|peritonit|jarrohlik|operatsiya|chandiq)\b/i, models: [AIModel.SURGEON] },
  // Travmatologiya
  { keywords: /\b(jarohat|travma|sinish|burilish|shikastlanish)\b/i, models: [AIModel.TRAUMATOLOGIST] },
  // Genetika
  { keywords: /\b(genetik|irsiy|kromosoma|mutatsiya)\b/i, models: [AIModel.GENETICIST] },
  // Og'riq
  { keywords: /\b(og'riq|kronik\s*og'riq|og'riq\s*boshqarish)\b/i, models: [AIModel.PAIN_MANAGEMENT] },
  // Uyqu
  { keywords: /\b(uyqu|insomniya|apnoe|uxlash)\b/i, models: [AIModel.SLEEP_MEDICINE] },
  // Oziqalanuvchanlik
  { keywords: /\b(oziq|parhez|vitamin|ozuqaviy)\b/i, models: [AIModel.NUTRITIONIST] },
  // Stomatologiya
  { keywords: /\b(tish|og'iz|stomatolog|gingivit|karies)\b/i, models: [AIModel.DENTIST] },
  // Proktologiya
  { keywords: /\b(ichak\s*past|proktolog|hemoroy|boshiq)\b/i, models: [AIModel.PROCTOLOGIST] },
  // Mammologiya
  { keywords: /\b(ko'krak|mammolog|o'sma\s*ko'krak)\b/i, models: [AIModel.MAMMOLOGIST] },
];

/** Barcha mutaxassislar (tizimdan tashqari) — to'ldirishda xilma-xil tanlash uchun */
const ALL_SPECIALISTS: AIModel[] = Object.values(AIModel).filter(m => m !== AIModel.SYSTEM);

/** Shikoyat matnidan oddiy hash (raqam) — bir xil shikoyat uchun bir xil tartib */
function simpleHash(str: string): number {
  let h = 0;
  const s = (str || '').trim();
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Kasallik/shikoyat bo'yicha 6–10 ta tegishli mutaxassisni aniqlaydi.
 * Har xil kasalliklar uchun har xil jamoa; bir xil standart jamoa takrorlanmaydi.
 */
export function getSpecialistsFromComplaint(complaint: string): { model: AIModel; reason: string }[] {
  const text = (complaint || '').trim();
  const seen = new Set<AIModel>();
  const result: { model: AIModel; reason: string }[] = [];

  for (const { keywords, models } of KEYWORD_TO_SPECIALISTS) {
    if (result.length >= 10) break;
    if (!keywords.test(text)) continue;
    for (const model of models) {
      if (seen.has(model)) continue;
      seen.add(model);
      result.push({ model, reason: 'Kasallik bo\'yicha tavsiya' });
    }
  }

  if (result.length < 6) {
    const remaining = ALL_SPECIALISTS.filter(m => !seen.has(m));
    const hash = simpleHash(text);
    const start = hash % Math.max(1, remaining.length);
    const ordered = [...remaining.slice(start), ...remaining.slice(0, start)];
    const need = 6 - result.length;
    for (let i = 0; i < need && i < ordered.length; i++) {
      const model = ordered[i];
      seen.add(model);
      result.push({ model, reason: 'Kengash tarkibi' });
    }
  }

  return result.slice(0, 10);
}

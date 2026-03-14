import React from 'react';
import {
    INSTITUTE_NAME_FULL,
    INSTITUTE_LOGO_TEXT,
    INSTITUTE_PHONE_1,
    INSTITUTE_PHONE_2,
    INSTITUTE_EMAIL_1,
    INSTITUTE_EMAIL_2,
    INSTITUTE_ADDRESS,
    FOOTER_COPYRIGHT,
    PLATFORM_NAME,
} from '../constants/brand';

interface Props {
    onBack: () => void;
}

/** Full text of Presidential Decree PQ-4911 (2020-12-03) - structured by clauses */
const DECREE_INTRODUCTION =
    "Sog'liqni saqlash, sanitariya-epidemiologik osoyishtalik va jamoat salomatligi sohasida yuqori malakaga ega oliy ma'lumotli kadrlarni tayyorlash, xodimlarni kasbiy rivojlantirish tizimini yanada takomillashtirish hamda tibbiyot tashkilotlari, shu jumladan birlamchi tibbiy-sanitariya yordami muassasalarini professional mutaxassislar bilan ta'minlash maqsadida:";

const DECREE_CLAUSES: { num: string; text: string }[] = [
    {
        num: '1',
        text: "Sog'liqni saqlash vazirligi, Iqtisodiy taraqqiyot va kambag'allikni qisqartirish vazirligi, Oliy va o'rta maxsus ta'lim vazirligi hamda Farg'ona viloyati hokimligining: Toshkent tibbiyot akademiyasi Farg'ona filiali negizida Farg'ona jamoat salomatligi tibbiyot institutini (keyingi o'rinlarda - Institut) tashkil etish; Farg'ona viloyati yuqumli kasalliklar shifoxonasini Institutning klinik bazasi etib belgilash to'g'risidagi takliflari ma'qullansin.",
    },
    {
        num: '2',
        text: "Quyidagilar Institut faoliyatining asosiy yo'nalishlari etib belgilansin: sog'liqni saqlash hamda sanitariya-epidemiologik osoyishtalik va jamoat salomatligi muassasalari uchun tor sohadagi mutaxassisliklar bo'yicha shifokorlarni tayyorlashni tashkil etish; yetakchi xorijiy tibbiyot oliy ta'lim muassasalari bilan hamkorlikda malakali mutaxassislarga ehtiyoj yuqori bo'lgan sohalar uchun qo'shma ta'lim va akademik mobillik dasturlari asosida kadrlar tayyorlash; zamonaviy bilim va ko'nikmalarga ega mutaxassislar tayyorlash jarayoniga ilg'or va masofaviy ta'lim texnologiyalarini keng joriy etish, yuqori malakali professor-o'qituvchilarni jalb etish, elektron ta'lim resurslarini ishlab chiqish va amaliyotga tatbiq qilish; ilmiy-pedagogik salohiyatning rivojlanishini qo'llab-quvvatlash, pedagogik texnologiyalar va o'qitish usullarini faol takomillashtirish; sog'liqni saqlash, sanitariya-epidemiologik osoyishtalik va jamoat salomatligini, kasalliklar profilaktikasi, parazitologiya, mikrobiologiya, virusologiya, sog'lom turmush tarzini rivojlantirish masalalari bo'yicha istiqbolli innovatsion, amaliy va fundamental ilmiy-tadqiqot ishlarini amalga oshirish, shuningdek, ularning natijalarini tibbiyot amaliyotidagi mavjud muammolar yechimiga qaratish; biriktirilgan Abu Ali ibn Sino nomidagi Jamoat salomatligi texnikumlari va tibbiyot kollejlari dasturlarining uzluksizligi va izchilligini ta'minlash, ular faoliyatini samarali tashkil qilish, ilmiy-uslubiy yordam ko'rsatib borish; xorijiy mamlakatlarning yetakchi tibbiyot tashkilotlari, ilmiy-tadqiqot markazlari bilan ta'lim hamda ilm-fan sohalarida uzoq muddatli hamkorlikni mustahkamlash va rivojlantirish; moddiy-texnika bazasini modernizatsiya qilish va mustahkamlash, simulatsion markaz, o'quv va ilmiy-tadqiqot laboratoriyalarini zamonaviy asbob-uskunalar bilan jihozlash.",
    },
    {
        num: '3',
        text: "Belgilansinki: Institut davlat oliy ta'lim muassasasi hisoblanadi, O'zbekiston Respublikasining Davlat gerbi tasviri tushirilgan va o'z nomi davlat tilida yozilgan muhrga va blankalarga, mustaqil balansga, shaxsiy g'azna hisobvarag'iga, shu jumladan xorijiy valyutadagi hisobvaraqlariga ega bo'ladi; Institut Toshkent tibbiyot akademiyasi Farg'ona filialining barcha huquqlari, majburiyatlari va shartnomalari bo'yicha huquqiy vorisi hisoblanadi; Institutga qabul har yili belgilanadigan O'zbekiston Respublikasining oliy ta'lim muassasalariga o'qishga qabul qilishning davlat buyurtmasi parametrlari doirasida va qo'shimcha qabul parametrlaridan kelib chiqqan holda amalga oshiriladi; Institut Farg'ona viloyatidagi Abu Ali ibn Sino nomidagi Jamoat salomatligi texnikumlari va tibbiyot kollejlarida aniq fanlar bo'yicha dars mashg'ulotlarini olib boruvchi o'qituvchilarga doimiy ravishda ilmiy-uslubiy yordam ko'rsatib boradi.",
    },
    {
        num: '4',
        text: "Sog'liqni saqlash vazirligi (A.Sh. Inoyatov) hamda Oliy va o'rta maxsus ta'lim vazirligi (U.Sh. Begimqulov) uch oy muddatda Institutga yuqori salohiyatga, jumladan fan nomzodi, fan doktori ilmiy darajasiga ega bo'lgan professor-o'qituvchilarni jalb qilsin.",
    },
    {
        num: '5',
        text: "Institut faoliyatini moliyalashtirish manbalari etib Davlat budjeti, talabalarning to'lov-kontrakt asosida ta'lim olishidan, shartnomalar asosida xizmat ko'rsatishdan tushadigan mablag'lar, xalqaro moliya va xorijiy tashkilotlarning grantlari, jismoniy va yuridik shaxslarning homiylik xayriyalari, shuningdek qonun hujjatlari bilan taqiqlanmagan boshqa manbalar belgilansin.",
    },
    {
        num: '6',
        text: "Sog'liqni saqlash vazirligi (A.Sh. Inoyatov) ikki oy muddatda: Institutda o'quv-metodik jarayonni tashkil etish, belgilangan tartibda shtatlar jadvali va xarajatlar smetasini tasdiqlash, zarur jihozlar bilan ta'minlash bo'yicha aniq chora-tadbirlarni amalga oshirish; Institut axborot-resurs markazini qo'shimcha o'quv, ilmiy va badiiy adabiyotlar bilan boyitish; Institut kafedralarini yo'nalishiga mos hamda imkoniyati keng bo'lgan Farg'ona viloyatida joylashgan davlat tibbiyot tashkilotlarida joylashtirish; respublikadagi tibbiyot oliy ta'lim muassasalari va boshqa xorijiy tibbiyot oliy ta'lim tashkilotlarining yuqori malakali professor-o'qituvchilarini jalb qilgan holda Institutda onlayn ma'ruza o'tkazish va masofaviy ta'lim texnologiyalarini joriy etish uchun telekommunikatsiya jihozlari bilan ta'minlash choralarini ko'rsin.",
    },
    {
        num: '7',
        text: "Sog'liqni saqlash vazirligi, Oliy va o'rta maxsus ta'lim vazirligi, Iqtisodiy taraqqiyot va kambag'allikni qisqartirish vazirligi, Innovatsion rivojlanish vazirligi, Vazirlar Mahkamasi huzuridagi Oliy attestatsiya komissiyasi hamda \"El-yurt umidi\" jamg'armasi: Institutni salohiyatli professor-o'qituvchilar bilan ta'minlash maqsadida yetakchi oliy ta'lim muassasalarida tegishli sohalar bo'yicha 2021/2022 o'quv yilidan boshlab bakalavriat ta'lim yo'nalishlari, klinik ordinatura, magistratura mutaxassisliklari va 2021-yildan boshlab tayanch doktoranturada kadrlarni maqsadli tayyorlash; ilg'or xorijiy tajribalarni o'rganib, kadrlar buyurtmachisi bo'lgan tashkilotlarning takliflarini inobatga olgan holda tegishli ta'lim yo'nalishlari va mutaxassisliklar bo'yicha fan dasturlarini takomillashtirilgan holda qayta ko'rib chiqish hamda belgilangan tartibda tasdiqlash; boshqarish tizimi samaradorligi va professor-o'qituvchilar uchun yaratilgan sharoitlar, ular tomonidan ta'lim berishda qo'llanilayotgan ta'lim-tarbiya usullarining ta'sirchanligiga xolisona baho berish; istiqbolli qo'shma ta'lim dasturlarini tashkil etish, hamkorlikning yangi shakllarini rivojlantirish, xorijiy professor-o'qituvchilar va vatandoshlarni jalb etish choralarini ko'rsin.",
    },
    {
        num: '8',
        text: "Iqtisodiy taraqqiyot va kambag'allikni qisqartirish vazirligi (A.M. Boboyev) manfaatdor vazirlik va idoralar bilan birgalikda tasdiqlangan loyiha-smeta hujjatlariga asosan Institutning bino va inshootlarini qurish, rekonstruksiya qilish, kapital ta'mirlash va jihozlash loyihalari O'zbekiston Respublikasining 2021 - 2023-yillarga mo'ljallangan Investitsiya dasturiga belgilangan tartibda kiritilishini ta'minlasin.",
    },
    {
        num: '9',
        text: "Axborot texnologiyalari va kommunikatsiyalarini rivojlantirish vazirligi (O.A. Pekos) Institut murojaatiga muvofiq uni belgilangan tartibda yuqori tezlikdagi Internet jahon axborot tarmog'iga ulash choralarini ko'rsin.",
    },
    {
        num: '10',
        text: "Farg'ona viloyati hokimligi (X.X. Bozarov) Sog'liqni saqlash vazirligi (A.Sh. Inoyatov) bilan birgalikda Institut faoliyatini samarali tashkil etish maqsadida jalb etiladigan malakali professor-o'qituvchilarni xizmat uylari bilan ta'minlash choralarini ko'rsin.",
    },
    {
        num: '11',
        text: "O'zbekiston Respublikasi Prezidentining 2019-yil 6-maydagi \"Tibbiyot va farmatsevtika ta'limi va ilm-fani tizimini yanada rivojlantirish chora-tadbirlari to'g'risida\"gi PQ-4310-son qaroriga 5-ilovaning \"Tibbiyot va farmatsevtika oliy ta'lim muassasalari, ularning filiallari va klinikalari\" bloki 9 - 11-bandlari quyidagi tahrirda bayon etilsin: \"9. Farg'ona jamoat salomatligi tibbiyot instituti 10. Toshkent tibbiyot akademiyasining Urganch filiali 11. Toshkent tibbiyot akademiyasining Termiz filiali\". Sog'liqni saqlash vazirligi manfaatdor vazirlik va idoralar bilan birgalikda ikki oy muddatda qonun hujjatlariga ushbu qarordan kelib chiqadigan o'zgartirish va qo'shimchalar to'g'risida Vazirlar Mahkamasiga takliflar kiritsin.",
    },
    {
        num: '12',
        text: "Mazkur qarorning ijrosini samarali tashkil etishga mas'ul va shaxsiy javobgar etib sog'liqni saqlash vaziri A.M. Xadjibayev, sog'liqni saqlash vazirining birinchi o'rinbosari A.Sh. Inoyatov, Farg'ona viloyati hokimi vazifasini bajaruvchi X.X. Bozarov belgilansin. Qaror ijrosini muhokama qilib borish, ijro uchun mas'ul idoralar faoliyatini muvofiqlashtirish va nazorat qilish O'zbekiston Respublikasi Prezidenti maslahatchisining birinchi o'rinbosari L.N. Tuychiyev va O'zbekiston Respublikasi Bosh vazirining o'rinbosari B.A. Musayev zimmasiga yuklansin. Amalga oshirilayotgan chora-tadbirlar natijadorligi yuzasidan 2021-yil 1-aprelga qadar O'zbekiston Respublikasi Prezidentiga axborot berilsin.",
    },
];

const DECREE_SIGNATURE = "O'zbekiston Respublikasi Prezidenti Sh. MIRZIYOYEV\nToshkent sh., 2020-yil 3-dekabr, PQ-4911-son\n(Qonun hujjatlari ma'lumotlari milliy bazasi, 04.12.2020-y., 07/20/4911/1594-son)";

const AboutInstitutePage: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
                <div className="page-px py-4 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Orqaga
                    </button>
                    <div className="text-center min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{INSTITUTE_LOGO_TEXT}</p>
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            {/* Hero */}
            <section className="relative py-12 sm:py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-slate-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30"
                         style={{ background: 'linear-gradient(135deg,#1d4ed8,#0891b2,#059669)' }}>
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
                        Rasmiy hujjat
                    </div>
                    <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight mb-3 uppercase text-white">
                        {INSTITUTE_NAME_FULL}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        O'zbekiston Respublikasi Prezidentining 2020-yil 3-dekabr, PQ-4911-son Qarori bilan tashkil etilgan
                    </p>
                </div>
            </section>

            {/* Decree title block */}
            <section className="page-px py-6 max-w-4xl mx-auto">
                <div className="rounded-2xl border border-amber-500/25 p-6 sm:p-8"
                     style={{ background: 'linear-gradient(135deg,rgba(120,53,15,0.25),rgba(180,83,9,0.12))' }}>
                    <p className="text-amber-400/90 text-xs font-bold uppercase tracking-widest mb-2">O'ZBEKISTON RESPUBLIKASI PREZIDENTINING QARORI</p>
                    <h2 className="text-white text-lg sm:text-xl font-black mb-4 leading-snug">
                        FARG'ONA JAMOAT SALOMATLIGI TIBBIYOT INSTITUTINI TASHKIL ETISH TO'G'RISIDA
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed">{DECREE_INTRODUCTION}</p>
                </div>
            </section>

            {/* Decree clauses 1-12 */}
            <section className="page-px py-4 max-w-4xl mx-auto space-y-5">
                {DECREE_CLAUSES.map((clause) => (
                    <div
                        key={clause.num}
                        className="rounded-2xl border border-white/10 p-5 sm:p-6"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 font-black text-sm">{clause.num}</span>
                            </div>
                            <div className="text-slate-300 text-sm sm:text-base leading-relaxed flex-1 min-w-0">
                                {clause.text}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Signature */}
            <section className="page-px py-6 max-w-4xl mx-auto">
                <div className="rounded-2xl border border-white/10 p-6 text-center sm:text-right"
                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{DECREE_SIGNATURE}</p>
                </div>
            </section>

            {/* Short stats */}
            <section className="page-px py-10 max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { num: '2020', label: 'Tashkil etilgan yil' },
                        { num: 'PQ-4911', label: 'Qaror raqami' },
                        { num: 'FJSTI', label: 'Qisqa nomi' },
                        { num: 'Davlat', label: 'Muassasa turi' },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-2xl p-5 text-center"
                            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                        >
                            <p className="text-blue-300 font-black text-xl sm:text-2xl mb-1">{s.num}</p>
                            <p className="text-slate-400 text-xs leading-tight">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="page-px py-10 max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-6">Aloqa ma'lumotlari</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        className="rounded-2xl p-5 col-span-1 sm:col-span-2"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Manzil</p>
                                <p className="text-white font-semibold text-sm">{INSTITUTE_ADDRESS}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-2xl p-5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Telefon</p>
                                <a href="tel:+998950442345" className="block text-white font-bold text-sm hover:text-sky-400 transition-colors">{INSTITUTE_PHONE_1}</a>
                                <a href="tel:+998950482345" className="block text-white font-bold text-sm hover:text-sky-400 transition-colors">{INSTITUTE_PHONE_2}</a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-2xl p-5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                                <a href={`mailto:${INSTITUTE_EMAIL_1}`} className="block text-white font-bold text-sm hover:text-violet-400 transition-colors">{INSTITUTE_EMAIL_1}</a>
                                <a href={`mailto:${INSTITUTE_EMAIL_2}`} className="block text-white text-sm hover:text-violet-400 transition-colors">{INSTITUTE_EMAIL_2}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-8">
                <div className="page-px py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-white font-black text-sm uppercase">{INSTITUTE_LOGO_TEXT}</p>
                        <p className="text-slate-500 text-xs mt-1">{FOOTER_COPYRIGHT}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{PLATFORM_NAME}</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        ← Bosh sahifaga qaytish
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AboutInstitutePage;

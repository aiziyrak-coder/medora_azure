import React from 'react';
import { INSTITUTE_NAME_FULL, INSTITUTE_NAME_SHORT, PLATFORM_NAME, PLATFORM_VERSION } from '../constants/brand';

interface Props {
    onBack: () => void;
}

const DECREE_SECTIONS = [
    {
        num: '1',
        title: "Institut tashkil etish",
        text: `Sog'liqni saqlash vazirligi, Iqtisodiy taraqqiyot va kambag'allikni qisqartirish vazirligi, Oliy va o'rta maxsus ta'lim vazirligi hamda Farg'ona viloyati hokimligining: Toshkent tibbiyot akademiyasi Farg'ona filiali negizida Farg'ona jamoat salomatligi tibbiyot institutini (keyingi o'rinlarda — Institut) tashkil etish; Farg'ona viloyati yuqumli kasalliklar shifoxonasini Institutning klinik bazasi etib belgilash to'g'risidagi takliflari ma'qullansin.`,
    },
    {
        num: '2',
        title: "Faoliyatning asosiy yo'nalishlari",
        text: `• Sog'liqni saqlash hamda sanitariya-epidemiologik osoyishtalik va jamoat salomatligi muassasalari uchun tor sohadagi mutaxassisliklar bo'yicha shifokorlarni tayyorlash\n• Yetakchi xorijiy tibbiyot oliy ta'lim muassasalari bilan hamkorlikda qo'shma ta'lim va akademik mobillik dasturlari asosida kadrlar tayyorlash\n• Ilg'or va masofaviy ta'lim texnologiyalarini keng joriy etish, yuqori malakali professor-o'qituvchilarni jalb etish\n• Ilmiy-pedagogik salohiyatning rivojlanishini qo'llab-quvvatlash\n• Sog'liqni saqlash, sanitariya-epidemiologik osoyishtalik va jamoat salomligi bo'yicha innovatsion va fundamental ilmiy-tadqiqot ishlarini amalga oshirish\n• Xorijiy mamlakatlarning yetakchi tibbiyot tashkilotlari, ilmiy-tadqiqot markazlari bilan hamkorlikni mustahkamlash`,
    },
    {
        num: '3',
        title: "Institut maqomi",
        text: `Institut davlat oliy ta'lim muassasasi hisoblanadi, O'zbekiston Respublikasining Davlat gerbi tasviri tushirilgan va o'z nomi davlat tilida yozilgan muhrga va blankalarga, mustaqil balansga, shaxsiy g'azna hisobvarag'iga, shu jumladan xorijiy valyutadagi hisobvaraqlariga ega bo'ladi. Institut Toshkent tibbiyot akademiyasi Farg'ona filialining barcha huquqlari, majburiyatlari va shartnomalari bo'yicha huquqiy vorisi hisoblanadi.`,
    },
    {
        num: '5',
        title: "Moliyalashtirish manbalari",
        text: `Institut faoliyatini moliyalashtirish manbalari etib Davlat budjeti, talabalarning to'lov-kontrakt asosida ta'lim olishidan, shartnomalar asosida xizmat ko'rsatishdan tushadigan mablag'lar, xalqaro moliya va xorijiy tashkilotlarning grantlari, jismoniy va yuridik shaxslarning homiylik xayriyalari, shuningdek qonun hujjatlari bilan taqiqlanmagan boshqa manbalar belgilansin.`,
    },
];

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
                    <div className="text-center min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{INSTITUTE_NAME_SHORT}</p>
                    </div>
                    <div className="w-16" /> {/* spacer */}
                </div>
            </header>

            {/* Hero */}
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-slate-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Emblem placeholder */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30"
                         style={{ background: 'linear-gradient(135deg,#1d4ed8,#0891b2,#059669)' }}>
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Rasmiy ma'lumot
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4 uppercase">
                        {INSTITUTE_NAME_FULL}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        O'zbekiston Respublikasi Prezidentining 2020-yil 3-dekabr, PQ-4911-son Qarori bilan tashkil etilgan
                    </p>
                </div>
            </section>

            {/* Decree banner */}
            <section className="page-px py-8 max-w-5xl mx-auto">
                <div className="rounded-2xl border border-amber-500/20 p-6 sm:p-8"
                     style={{ background: 'linear-gradient(135deg,rgba(120,53,15,0.2),rgba(180,83,9,0.1))' }}>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Prezident Qarori</p>
                            <h2 className="text-white text-lg sm:text-xl font-black mb-2">
                                FARG'ONA JAMOAT SALOMATLIGI TIBBIYOT INSTITUTINI TASHKIL ETISH TO'G'RISIDA
                            </h2>
                            <p className="text-slate-400 text-sm">
                                O'zbekiston Respublikasi Prezidenti Sh. MIRZIYOYEV · Toshkent sh., 2020-yil 3-dekabr, PQ-4911-son
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 pt-5 border-t border-amber-500/15 text-slate-300 text-sm leading-relaxed">
                        Sog'liqni saqlash, sanitariya-epidemiologik osoyishtalik va jamoat salomatligi sohasida yuqori malakaga ega oliy ma'lumotli kadrlarni tayyorlash, xodimlarni kasbiy rivojlantirish tizimini yanada takomillashtirish hamda tibbiyot tashkilotlari, shu jumladan birlamchi tibbiy-sanitariya yordami muassasalarini professional mutaxassislar bilan ta'minlash maqsadida qaror qabul qilingan.
                    </div>
                </div>
            </section>

            {/* Decree sections */}
            <section className="page-px py-4 max-w-5xl mx-auto space-y-5">
                {DECREE_SECTIONS.map(s => (
                    <div key={s.num} className="rounded-2xl border border-white/8 p-6 sm:p-8"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 font-black text-sm">{s.num}</span>
                            </div>
                            <h3 className="text-white font-bold text-base sm:text-lg">{s.title}</h3>
                        </div>
                        <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line pl-11">
                            {s.text}
                        </div>
                    </div>
                ))}
            </section>

            {/* Stats */}
            <section className="page-px py-12 max-w-5xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { num: '2020', label: 'Tashkil etilgan yil' },
                        { num: 'PQ-4911', label: 'Qaror raqami' },
                        { num: 'FJSTI', label: 'Qisqa nomi' },
                        { num: 'Davlat', label: 'Muassasa turi' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl p-5 text-center"
                             style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)' }}>
                            <p className="text-blue-300 font-black text-xl sm:text-2xl mb-1">{s.num}</p>
                            <p className="text-slate-400 text-xs leading-tight">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="page-px py-10 max-w-5xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-6">Aloqa ma'lumotlari</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Address */}
                    <div className="rounded-2xl p-5 col-span-1 sm:col-span-2"
                         style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Manzil</p>
                                <p className="text-white font-semibold text-sm">Farg'ona sh., Yangi Turon, 2-a uy</p>
                            </div>
                        </div>
                    </div>
                    {/* Phones */}
                    <div className="rounded-2xl p-5"
                         style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Telefon</p>
                                <a href="tel:+998950442345" className="block text-white font-bold text-sm hover:text-sky-400 transition-colors">+998 95 044-23-45</a>
                                <a href="tel:+998950482345" className="block text-white font-bold text-sm hover:text-sky-400 transition-colors">+998 95 048-23-45</a>
                            </div>
                        </div>
                    </div>
                    {/* Email */}
                    <div className="rounded-2xl p-5"
                         style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                                <a href="mailto:info@fjsti.uz" className="block text-white font-bold text-sm hover:text-violet-400 transition-colors">info@fjsti.uz</a>
                                <a href="mailto:fmioz@mail.ru" className="block text-white text-sm hover:text-violet-400 transition-colors">fmioz@mail.ru</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-8">
                <div className="page-px py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-white font-black text-sm">{INSTITUTE_NAME_SHORT}</p>
                        <p className="text-slate-500 text-xs">{INSTITUTE_NAME_FULL}</p>
                    </div>
                    <p className="text-slate-500 text-xs text-center">
                        &copy; CDCGroup 2026 · {PLATFORM_NAME} {PLATFORM_VERSION}
                    </p>
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

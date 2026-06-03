import React, { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Github, Languages, ScrollText, Sparkles, X } from "lucide-react";
import { Language } from "../types";
import { translations } from "../utils/translations";
import { externalLinks } from "../utils/links";

interface OnboardingGuideProps {
  open: boolean;
  lang: Language;
  setLang: (lang: Language) => void;
  onClose: () => void;
}

const languageOptions: Array<{ lang: Language; label: string; shortLabel: string }> = [
  { lang: "zh", label: "简体中文", shortLabel: "ZH" },
  { lang: "en", label: "English", shortLabel: "EN" },
  { lang: "ja", label: "日本語", shortLabel: "JA" },
];

export default function OnboardingGuide({ open, lang, setLang, onClose }: OnboardingGuideProps) {
  const t = translations[lang];
  const [phase, setPhase] = useState<"language" | "guide">("language");

  useEffect(() => {
    if (open) {
      setPhase(localStorage.getItem("genso-geo-guide-seen") === "true" ? "guide" : "language");
    }
  }, [open]);

  if (!open) return null;

  const chooseLanguage = (nextLang: Language) => {
    setLang(nextLang);
    setPhase("guide");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#231915]/45 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-3 md:p-6">
      <div className="relative my-3 md:my-0 w-full max-w-4xl max-h-none md:max-h-[92vh] overflow-visible md:overflow-hidden rounded-2xl border border-[#eadfca] bg-[#fffdf8] shadow-2xl">
        <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(135deg,#7f1d1d_0,#7f1d1d_1px,transparent_1px,transparent_18px)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-800 via-amber-400 to-rose-800" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-rose-100 bg-white/80 text-slate-500 shadow-sm transition hover:text-rose-700 cursor-pointer"
          aria-label="Close guide"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative grid md:grid-cols-[0.95fr_1.45fr]">
          <aside className="bg-[#831b22] text-white p-5 md:p-7 overflow-hidden relative">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,#facc15_0,transparent_24%),radial-gradient(circle_at_80%_10%,#fff_0,transparent_18%)]" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="GENSO-GEO" className="h-12 w-12 rounded-xl bg-white p-1 shadow-lg" />
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-amber-200">GENSO-GEO</p>
                  <h2 className="text-2xl md:text-3xl font-serif font-black leading-tight">{t.guideLanguageTitle}</h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-rose-50">{t.guideLanguageIntro}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.lang}
                    type="button"
                    onClick={() => chooseLanguage(option.lang)}
                    className={`rounded-xl border px-3 py-3 text-center transition cursor-pointer ${
                      lang === option.lang
                        ? "border-amber-200 bg-white text-rose-800 shadow-md"
                        : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="block text-xs font-black">{option.shortLabel}</span>
                    <span className="mt-1 block text-[10px] font-bold">{option.label}</span>
                  </button>
                ))}
              </div>

              <p className="mt-5 rounded-xl border border-white/15 bg-white/10 p-3 text-xs leading-6 text-rose-50">
                {t.guidePersonaNote}
              </p>
            </div>
          </aside>

          {phase === "language" ? (
            <section className="relative p-5 md:p-7 overflow-visible md:overflow-y-auto max-h-none md:max-h-[92vh] flex flex-col justify-start md:justify-center">
              <p className="text-[10px] font-black tracking-[0.18em] text-rose-700 uppercase flex items-center gap-2">
                <Languages className="h-3.5 w-3.5" />
                Language Gate
              </p>
              <h3 className="mt-2 text-2xl md:text-4xl font-serif font-black text-slate-900">{t.guideLanguageTitle}</h3>
              <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">{t.guideLanguageIntro}</p>
              <div className="mt-6 grid gap-3">
                {languageOptions.map((option) => (
                  <button
                    key={option.lang}
                    type="button"
                    onClick={() => chooseLanguage(option.lang)}
                    className="flex items-center justify-between rounded-xl border border-[#eadfca] bg-white/80 p-4 text-left shadow-sm transition hover:border-rose-200 hover:bg-rose-50 cursor-pointer"
                  >
                    <span>
                      <span className="block text-sm font-black text-slate-900">{option.label}</span>
                      <span className="mt-1 block text-xs text-slate-500">{option.shortLabel}</span>
                    </span>
                    <span className="text-rose-700 font-black">→</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 self-start px-5 py-3 rounded-xl border border-[#eadfca] bg-white text-xs font-black text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                {t.guideLater}
              </button>
            </section>
          ) : (
          <section className="relative p-5 md:p-7 overflow-visible md:overflow-y-auto max-h-none md:max-h-[92vh]">
            <div className="pr-10">
              <p className="text-[10px] font-black tracking-[0.18em] text-rose-700 uppercase flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Hakurei Shrine Notice
              </p>
              <h3 className="mt-2 text-2xl md:text-4xl font-serif font-black text-slate-900">{t.guideTitle}</h3>
              <p className="mt-2 text-sm md:text-base leading-7 text-slate-600">{t.guideSubtitle}</p>
            </div>

            <div className="mt-6 grid gap-4">
              <section className="rounded-xl border border-[#eadfca] bg-white/75 p-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-[#7c2d12]">
                  <ScrollText className="h-4 w-4 text-rose-700" />
                  {t.guidePurposeTitle}
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">{t.guidePurposeBody}</p>
              </section>

              <section className="rounded-xl border border-[#eadfca] bg-white/75 p-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-[#7c2d12]">
                  <Languages className="h-4 w-4 text-rose-700" />
                  {t.guideHowTitle}
                </h4>
                <div className="mt-3 grid gap-2">
                  {[t.guideStepMap, t.guideStepStyle, t.guideStepSave].map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-lg bg-[#faf7ef] p-3 text-sm leading-6 text-slate-700">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-700 text-[11px] font-black text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#eadfca] bg-white/75 p-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-[#7c2d12]">
                  <BookOpen className="h-4 w-4 text-rose-700" />
                  {t.guideLinksTitle}
                </h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <GuideLink icon={<Github className="h-4 w-4" />} href={externalLinks.github} label={t.navGithub} desc={t.guideGithubDesc} />
                  <GuideLink icon={<BookOpen className="h-4 w-4" />} href={externalLinks.blog} label={t.navBlog} desc={t.guideBlogDesc} />
                  <GuideLink icon={<ExternalLink className="h-4 w-4" />} href={externalLinks.works} label={t.navWorks} desc={t.guideWorksDesc} />
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-[#eadfca] bg-white text-xs font-black text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                {t.guideLater}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-rose-700 text-xs font-black text-white shadow-lg shadow-rose-200/60 hover:bg-rose-800 transition cursor-pointer"
              >
                {t.guideStart}
              </button>
            </div>
          </section>
          )}
        </div>
      </div>
    </div>
  );
}

function GuideLink({ icon, href, label, desc }: { icon: React.ReactNode; href: string; label: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-[#eadfca] bg-[#faf7ef] p-3 text-slate-700 transition hover:border-rose-200 hover:bg-rose-50"
    >
      <span className="flex items-center gap-2 text-xs font-black text-rose-700">
        {icon}
        {label}
      </span>
      <span className="mt-2 block text-[11px] leading-5 text-slate-500">{desc}</span>
    </a>
  );
}

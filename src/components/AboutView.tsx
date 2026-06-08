import React from "react";
import { BookOpen, ExternalLink, Feather, Github, MapPinned, ScrollText, Sparkles, Torus } from "lucide-react";
import { Language } from "../types";
import { translations } from "../utils/translations";
import { externalLinks } from "../utils/links";

interface AboutViewProps {
  lang: Language;
}

export default function AboutView({ lang }: AboutViewProps) {
  const t = translations[lang];

  const features = [
    {
      icon: <MapPinned className="h-5 w-5" />,
      title: t.aboutFeatureMapTitle,
      body: t.aboutFeatureMapBody,
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: t.aboutFeatureDescTitle,
      body: t.aboutFeatureDescBody,
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: t.aboutFeatureCollectionTitle,
      body: t.aboutFeatureCollectionBody,
    },
    {
      icon: <ScrollText className="h-5 w-5" />,
      title: t.aboutFeatureBoardTitle,
      body: t.aboutFeatureBoardBody,
    },
  ];

  const principles = [
    t.aboutPrincipleCreative,
    t.aboutPrincipleInvisibleAi,
    t.aboutPrincipleOpen,
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5efe4] text-slate-800">
      <section className="relative overflow-hidden border-b border-[#e2d4bd] bg-[#8f1d25] text-white">
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_1px,transparent_1px,transparent_18px)]" />
        <div className="absolute -right-16 top-8 text-[13rem] font-serif leading-none text-white/10 select-none">霊</div>
        <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-9 md:grid-cols-[1fr_17rem] md:px-8 md:py-12">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
              <Torus className="h-4 w-4" />
              {t.aboutKicker}
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-serif font-black tracking-normal md:text-5xl">
              {t.aboutTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-rose-50 md:text-base">
              {t.aboutSubtitle}
            </p>
          </div>

          <div className="relative hidden min-h-44 items-center justify-center md:flex">
            <div className="absolute h-44 w-44 rounded-full border border-white/20" />
            <div className="absolute h-28 w-28 rounded-full border border-amber-200/30" />
            <img src="/logo.svg" alt="" className="relative h-24 w-24 rounded-full border border-white/30 bg-white/90 p-3 shadow-lg" />
            <p className="absolute bottom-0 max-w-60 text-center text-sm font-bold leading-6 text-white">
              {t.aboutSealText}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-[#e5d1ac] bg-[#fff9ed] p-4 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-rose-100 bg-white text-rose-800 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-serif font-black text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e2d4bd] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1fr_1fr] md:px-8 md:py-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">
              <Feather className="h-4 w-4" />
              {t.aboutInspirationKicker}
            </p>
            <h3 className="mt-3 text-2xl font-serif font-black text-slate-950 md:text-3xl">{t.aboutInspirationTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t.aboutInspirationBody}</p>
          </div>

          <div className="rounded-2xl border border-dashed border-[#d6c3a3] bg-[#faf7ef] p-5">
            <h4 className="text-sm font-black text-[#7c2d12]">{t.aboutPrinciplesTitle}</h4>
            <div className="mt-4 space-y-3">
              {principles.map((principle) => (
                <p key={principle} className="rounded-xl border border-[#eadfca] bg-white/75 px-3 py-3 text-xs font-bold leading-6 text-slate-700">
                  {principle}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-serif font-black text-slate-950">{t.aboutLinksTitle}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{t.aboutLinksBody}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AboutLink href={externalLinks.github} label={t.navGithub} icon={<Github className="h-4 w-4" />} />
            <AboutLink href={externalLinks.blog} label={t.navBlog} icon={<BookOpen className="h-4 w-4" />} />
            <AboutLink href={externalLinks.works} label={t.navWorks} icon={<ExternalLink className="h-4 w-4" />} />
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-white px-4 py-3 text-xs font-black text-rose-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
    >
      {icon}
      {label}
    </a>
  );
}

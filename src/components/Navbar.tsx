import React from 'react';
import { ViewMode, Language } from '../types';
import { BookOpen, CircleHelp, ExternalLink, Github, Globe, Info, ScrollText } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { translations } from '../utils/translations';
import { externalLinks } from '../utils/links';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  collectionCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
  openGuide: () => void;
}

export default function Navbar({ viewMode, setViewMode, collectionCount, lang, setLang, openGuide }: NavbarProps) {
  const t = translations[lang];

  const cycleLanguage = () => {
    if (lang === 'zh') {
      setLang('en');
    } else if (lang === 'en') {
      setLang('ja');
    } else {
      setLang('zh');
    }
  };

  const getLanguageLabel = () => {
    if (lang === 'zh') return '简体中文 🇨🇳';
    if (lang === 'en') return 'English 🇬🇧';
    return '日本語 🇯🇵';
  };

  return (
    <header className="min-h-16 flex flex-wrap items-center justify-between gap-3 px-3 py-2 md:px-8 md:py-0 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10 relative">
      <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
        <img
          src="/logo.svg"
          alt="GENSO-GEO"
          className="w-8 h-8 md:w-9 md:h-9 rounded-2xl shadow-md border border-rose-100 shrink-0"
        />
        <h1 className="text-base md:text-xl font-bold tracking-tight text-slate-900 flex items-baseline min-w-0">
          <span className="font-serif text-rose-600 font-extrabold tracking-wide">{t.appNameMain}</span>
          <span className="text-rose-600 text-sm font-light ml-1.5 hidden md:inline">
            {t.appNameSub}
          </span>
        </h1>
      </div>
      
      <nav className="order-3 md:order-none w-full md:w-auto flex justify-center md:justify-start gap-3 md:space-x-6 text-xs md:text-sm font-medium text-slate-500 h-10 md:h-full overflow-x-auto">
        <button
          onClick={() => setViewMode('map')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2",
            viewMode === 'map' ? "text-rose-600 border-b-2 border-rose-600" : "hover:text-slate-900 border-b-2 border-transparent"
          )}
        >
          {t.navGenerator}
        </button>
        <button
          onClick={() => setViewMode('collection')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2",
            viewMode === 'collection' ? "text-rose-600 border-b-2 border-rose-600" : "hover:text-slate-900 border-b-2 border-transparent"
          )}
        >
          {t.navCollections}
          {collectionCount > 0 && (
            <span className="ml-2 text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
              {collectionCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setViewMode('plaza')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer whitespace-nowrap shrink-0 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2",
            viewMode === 'plaza' ? "text-rose-600 border-b-2 border-rose-600" : "hover:text-slate-900 border-b-2 border-transparent"
          )}
        >
          <ScrollText className="w-3.5 h-3.5" />
          {t.navPlaza}
        </button>
        <button
          onClick={() => setViewMode('about')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer whitespace-nowrap shrink-0 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2",
            viewMode === 'about' ? "text-rose-600 border-b-2 border-rose-600" : "hover:text-slate-900 border-b-2 border-transparent"
          )}
        >
          <Info className="w-3.5 h-3.5" />
          {t.navAbout}
        </button>
      </nav>
      
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={openGuide}
          className="grid h-9 w-9 place-items-center rounded-full border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all cursor-pointer shadow-sm"
          title={t.guideReopen}
          aria-label={t.guideReopen}
        >
          <CircleHelp className="w-4 h-4" />
        </button>
        <IconLink href={externalLinks.github} title={t.navGithub}>
          <Github className="w-4 h-4" />
        </IconLink>
        <IconLink href={externalLinks.blog} title={t.navBlog}>
          <BookOpen className="w-4 h-4" />
        </IconLink>
        <IconLink href={externalLinks.works} title={t.navWorks}>
          <ExternalLink className="w-4 h-4" />
        </IconLink>
        <button 
          onClick={cycleLanguage}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/20 text-[11px] md:text-xs font-semibold select-none transition-all cursor-pointer shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">{getLanguageLabel()}</span>
          <span className="sm:hidden">{lang.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}

function IconLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all shadow-sm"
      title={title}
      aria-label={title}
    >
      {children}
    </a>
  );
}

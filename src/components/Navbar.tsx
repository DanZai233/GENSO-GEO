import React from 'react';
import { ViewMode, Language } from '../types';
import { Map, Library, BookText, Globe } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { translations } from '../utils/translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  collectionCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function Navbar({ viewMode, setViewMode, collectionCount, lang, setLang }: NavbarProps) {
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
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10 relative">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 via-rose-500 to-red-600 flex items-center justify-center shadow-md border-2 border-slate-100 relative select-none">
          {/* Inner ring for magical spellcard feel */}
          <div className="absolute inset-0.5 rounded-full border border-white/20"></div>
          <span className="text-white font-serif font-black text-lg drop-shadow">
            ☯
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-baseline">
          <span className="font-serif text-rose-600 font-extrabold tracking-wide">{t.appNameMain}</span>
          <span className="text-rose-600 text-sm font-light ml-1.5 hidden md:inline">
            {t.appNameSub}
          </span>
        </h1>
      </div>
      
      <nav className="flex space-x-6 text-sm font-medium text-slate-500 h-full">
        <button
          onClick={() => setViewMode('map')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer",
            viewMode === 'map' ? "text-rose-600 border-b-2 border-rose-600" : "hover:text-slate-900 border-b-2 border-transparent"
          )}
        >
          {t.navGenerator}
        </button>
        <button
          onClick={() => setViewMode('collection')}
          className={cn(
            "h-full flex items-center transition-colors px-1 cursor-pointer",
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
      </nav>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={cycleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/20 text-xs font-semibold select-none transition-all cursor-pointer shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-rose-500" />
          <span>{getLanguageLabel()}</span>
        </button>
      </div>
    </header>
  );
}

import React, { useRef } from 'react';
import { NameEntry, Language } from '../types';
import { Trash2, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { translations } from '../utils/translations';

interface CollectionViewProps {
  collection: NameEntry[];
  onRemove: (id: string) => void;
  lang: Language;
}

export default function CollectionView({ collection, onRemove, lang }: CollectionViewProps) {
  const t = translations[lang];
  
  if (collection.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-100 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">{t.noCharactersTitle}</h3>
        <p className="max-w-md text-sm text-slate-500 leading-relaxed">{t.noCharactersDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#EAE9E4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{t.collectionsTitle}</h2>
          <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">{collection.length} {t.savedCount}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {collection.map(entry => (
            <CharacterCard key={entry.id} entry={entry} onRemove={onRemove} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ entry, onRemove, lang }: { key?: string; entry: NameEntry, onRemove: (id: string) => void, lang: Language }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const exportAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      const filename = lang === 'ja'
        ? `${(entry.fullName_ja || entry.fullName || "GensouCard")}_GeoCard.png`
        : lang === 'zh' 
        ? `${(entry.fullName_zh || entry.fullName || "Geocard")}_GeoCard.png`
        : `${(entry.fullName_en || entry.fullName || "Geocard").replace(/\s+/g, '_')}_GeoCard.png`;
      link.download = filename;
      link.href = image;
      link.click();
    } catch (e) {
      console.error("Export failed", e);
      alert(t.exportFailed);
    }
  };

  const namePrimary = lang === 'zh'
    ? (entry.fullName_zh || entry.fullName)
    : lang === 'ja'
    ? (entry.fullName_ja || entry.fullName)
    : (entry.fullName_en || entry.fullName);

  const nameSecondary = lang === 'zh'
    ? (entry.fullName_en || `${entry.firstName_en || ''} ${entry.lastName_en || ''}`)
    : lang === 'ja'
    ? (entry.fullName_zh || `${entry.lastName_zh || ''}${entry.firstName_zh || ''}`)
    : (entry.fullName_zh || `${entry.lastName_zh || ''}${entry.firstName_zh || ''}`);

  const displayOrigin = lang === 'zh'
    ? (entry.placeName_zh || entry.placeName)
    : lang === 'ja'
    ? (entry.placeName_ja || entry.placeName)
    : (entry.placeName_en || entry.placeName);

  const displayInspiration = lang === 'zh'
    ? (entry.inspiration_zh || entry.inspiration)
    : lang === 'ja'
    ? (entry.inspiration_ja || entry.inspiration)
    : (entry.inspiration_en || entry.inspiration);

  const displayArchetype = lang === 'zh'
    ? (entry.characterArchetype_zh || entry.characterArchetype)
    : lang === 'ja'
    ? (entry.characterArchetype_ja || entry.characterArchetype)
    : (entry.characterArchetype_en || entry.characterArchetype);

  return (
    <div className="group flex flex-col">
      {/* Printable Card Area */}
      <div ref={cardRef} className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col relative">
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 bg-rose-50 border border-rose-150 rounded-full flex items-center justify-center text-rose-700 font-serif font-bold text-lg select-none">
            {lang === 'ja' ? '☯' : lang === 'zh' ? (entry.lastName_zh ? entry.lastName_zh.charAt(0) : '博') : (entry.firstName_en ? entry.firstName_en.charAt(0) : 'G')}
          </div>
          <button onClick={() => onRemove(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1.5">{t.originLabel}: {displayOrigin}</p>
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
          <h4 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-800">{namePrimary}</h4>
          <span className="text-xs font-light text-slate-400 font-sans tracking-wide">{nameSecondary}</span>
        </div>

        {/* Holistic Multilingual Name Register Grid (CN, JA, EN, Romaji) */}
        <div className="mt-2 text-[10px] grid grid-cols-2 gap-x-2 gap-y-1 bg-rose-50/25 p-2 rounded-lg border border-rose-100/40 font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span className="text-rose-700 font-bold font-serif shadow-sm">汉:</span> 
            <span className="truncate">{entry.fullName_zh || entry.fullName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-rose-700 font-bold font-serif shadow-sm">日:</span> 
            <span className="truncate">{entry.fullName_ja || entry.fullName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-rose-700 font-bold font-serif shadow-sm">英:</span> 
            <span className="truncate">{entry.fullName_en || entry.fullName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#a11f3d] font-bold font-serif shadow-sm">音:</span> 
            <span className="truncate font-sans font-semibold text-amber-900">{entry.fullName_romaji || entry.fullName_en}</span>
          </div>
        </div>

        <div className="mt-3 text-[10px] inline-flex self-start px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-100 rounded font-medium">
          {t.typeLabel}: {displayArchetype}
        </div>
        
        <p className="text-[11px] text-slate-500 mt-4 line-clamp-4 italic flex-1 leading-relaxed border-l-2 border-rose-100 pl-3">
          {displayInspiration}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
           <span className="text-[10px] text-slate-400 font-mono tracking-widest">{t.idPrefix}: CN-{entry.id.substring(0, 6).toUpperCase()}</span>
           <button onClick={exportAsImage} className="text-[11px] font-bold text-slate-900 underline flex items-center gap-1 hover:text-rose-600 cursor-pointer select-none">
             {t.exportPng}
           </button>
        </div>
      </div>
    </div>
  );
}

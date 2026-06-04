import React, { useEffect, useState } from "react";
import { RefreshCw, ScrollText, Torus } from "lucide-react";
import { EmaNote, Language } from "../types";
import { translations } from "../utils/translations";
import { fetchEmaNotes } from "../utils/emaNotes";
import EmaNoteCard from "./EmaNoteCard";

interface EmaPlazaViewProps {
  lang: Language;
  goToMap: () => void;
}

export default function EmaPlazaView({ lang, goToMap }: EmaPlazaViewProps) {
  const t = translations[lang];
  const [notes, setNotes] = useState<EmaNote[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    try {
      setNotes(await fetchEmaNotes(80));
    } catch (error) {
      console.error("Failed to load ema plaza", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotes();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4efe4]">
      <section className="relative overflow-hidden border-b border-[#e2d4bd] bg-[#8f1d25] text-white">
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_1px,transparent_1px,transparent_18px)]" />
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
            <ScrollText className="h-4 w-4" />
            Bunka Ema Dispatch
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-black tracking-normal">{t.plazaTitle}</h2>
              <p className="mt-3 max-w-3xl text-sm md:text-base leading-7 text-rose-50">{t.plazaSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={loadNotes}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-black text-white transition hover:bg-white/20 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {t.plazaRefresh}
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {loading ? (
          <div className="rounded-xl border border-dashed border-[#d6c3a3] bg-white/75 p-8 text-center text-sm font-bold text-slate-500">
            {t.plazaLoading}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <EmaNoteCard key={note.id} note={note} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e5d1ac] bg-[#fff9ed] p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-rose-100 bg-white text-rose-800">
              <Torus className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t.plazaEmpty}</p>
            <button
              type="button"
              onClick={goToMap}
              className="mt-5 rounded-xl bg-rose-700 px-5 py-3 text-xs font-black text-white shadow-lg shadow-rose-200/60 transition hover:bg-rose-800 cursor-pointer"
            >
              {t.plazaVisitMap}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

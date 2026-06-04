import React from "react";
import { Clock, Mail, MapPinned, Navigation, ScrollText, UserRound, X } from "lucide-react";
import { EmaNote, Language } from "../types";
import { translations } from "../utils/translations";
import {
  formatEmaTime,
  getEntryArchetype,
  getEntryCountry,
  getEntryInspiration,
  getEntryName,
  getEntryPlace,
} from "../utils/emaNotes";

interface BunkaNoteDetailDialogProps {
  note: EmaNote | null;
  lang: Language;
  onClose: () => void;
  onLocate?: (note: EmaNote) => void;
}

export default function BunkaNoteDetailDialog({ note, lang, onClose, onLocate }: BunkaNoteDetailDialogProps) {
  const t = translations[lang];

  if (!note) return null;

  const name = getEntryName(note.entry, lang);
  const place = getEntryPlace(note.entry, lang);
  const country = getEntryCountry(note.entry, lang);
  const archetype = getEntryArchetype(note.entry, lang);
  const inspiration = getEntryInspiration(note.entry, lang);
  const authorName = note.authorName?.trim() || t.bunkaAnonymous;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#241711]/55 p-3 backdrop-blur-sm md:items-center md:p-6">
      <article className="relative my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#eadfca] bg-[#fffdf8] shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-800 via-amber-300 to-rose-800" />
        <div className="absolute -right-8 top-10 text-9xl font-serif text-rose-900/5 select-none">文</div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-rose-100 bg-white/85 text-slate-500 shadow-sm transition hover:text-rose-700 cursor-pointer"
          aria-label={t.emaCloseNote}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-5 md:p-7">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">
            <ScrollText className="h-4 w-4" />
            {t.emaNoteTitle}
          </p>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-serif font-black text-slate-950 tracking-normal md:text-4xl">{name}</h2>
              {note.entry.fullName_romaji && (
                <p className="mt-2 text-xs font-mono font-black uppercase tracking-wider text-amber-800">{note.entry.fullName_romaji}</p>
              )}
              <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#7c2d12]">
                <MapPinned className="h-4 w-4" />
                {place}{country ? ` / ${country}` : ""}
              </p>
            </div>

            {onLocate && (
              <button
                type="button"
                onClick={() => onLocate(note)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 py-3 text-xs font-black text-white shadow-lg shadow-rose-200/60 transition hover:bg-rose-800 cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                {t.bunkaLocateOnMap}
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <InfoPill icon={<UserRound className="h-4 w-4" />} label={t.bunkaReporter} value={authorName} />
            <InfoPill icon={<Clock className="h-4 w-4" />} label={t.emaCardTime} value={formatEmaTime(note.createdAt, lang)} />
            <InfoPill label={t.emaCardCountry} value={[note.visitorCountry, note.visitorRegion, note.visitorCity].filter(Boolean).join(" / ")} />
            <InfoPill label={t.bunkaCoordinates} value={`${note.lat.toFixed(5)}, ${note.lng.toFixed(5)} · ${note.radiusKm}km`} />
          </div>

          {note.email && (
            <a
              href={`mailto:${note.email}`}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-50"
            >
              <Mail className="h-4 w-4" />
              {t.plazaEmail}
            </a>
          )}

          <section className="mt-5 rounded-xl border border-[#eadfca] bg-[#faf7ef] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7c2d12]">{t.emaMessageLabel}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">{note.message}</p>
          </section>

          <section className="mt-4 rounded-xl border border-rose-100 bg-rose-50/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">{t.bunkaGeneratedRecord}</p>
            {archetype && (
              <p className="mt-3 inline-flex rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">
                {archetype}
              </p>
            )}
            {inspiration && <p className="mt-3 text-xs leading-6 text-slate-600">{inspiration}</p>}
          </section>
        </div>
      </article>
    </div>
  );
}

function InfoPill({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-[#eadfca] bg-white/75 px-3 py-2">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-bold leading-5 text-slate-700">{value}</p>
    </div>
  );
}

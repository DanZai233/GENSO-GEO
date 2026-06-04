import React from "react";
import { Mail, MapPin, ScrollText, UserRound } from "lucide-react";
import { EmaNote, Language } from "../types";
import { translations } from "../utils/translations";
import {
  formatEmaTime,
  getEntryArchetype,
  getEntryCountry,
  getEntryName,
  getEntryPlace,
} from "../utils/emaNotes";

interface EmaNoteCardProps {
  key?: React.Key;
  note: EmaNote;
  lang: Language;
  compact?: boolean;
  onSelect?: (note: EmaNote) => void;
}

export default function EmaNoteCard({ note, lang, compact = false, onSelect }: EmaNoteCardProps) {
  const t = translations[lang];
  const name = getEntryName(note.entry, lang);
  const place = getEntryPlace(note.entry, lang);
  const country = getEntryCountry(note.entry, lang);
  const archetype = getEntryArchetype(note.entry, lang);
  const authorName = note.authorName?.trim() || t.bunkaAnonymous;

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(note) : undefined}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(note);
        }
      }}
      className={`relative overflow-hidden rounded-xl border border-[#e5d1ac] bg-[#fff9ed] shadow-sm transition ${onSelect ? "cursor-pointer hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md" : ""}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-amber-300 to-rose-800" />
      <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full border border-rose-200/50 bg-rose-50/30" />
      <div className="absolute right-4 top-4 text-rose-900/10 text-5xl font-serif select-none">文</div>

      <div className={compact ? "p-3" : "p-4 md:p-5"}>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rose-100 bg-white text-rose-800 shadow-sm">
            <ScrollText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className={`${compact ? "text-sm" : "text-lg"} font-serif font-black text-slate-900 tracking-normal`}>
              {name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7c2d12]">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{place}{country ? ` · ${country}` : ""}</span>
            </p>
          </div>
        </div>

        {archetype && (
          <p className="mt-3 inline-flex rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">
            {archetype}
          </p>
        )}

        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/70 px-2.5 py-1 text-[10px] font-black text-rose-800">
          <UserRound className="h-3 w-3" />
          {t.bunkaReporter}: {authorName}
        </p>

        <p className={`${compact ? "mt-3 line-clamp-3 text-xs" : "mt-4 text-sm"} leading-6 text-slate-700`}>
          {note.message}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#eadfca] pt-3 text-[10px] font-bold text-slate-500">
          <span>{t.emaCardTime}: {formatEmaTime(note.createdAt, lang)}</span>
          {note.visitorCountry && <span>{t.emaCardCountry}: {note.visitorCountry}</span>}
          {note.email && (
            <a
              href={`mailto:${note.email}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900"
            >
              <Mail className="h-3 w-3" />
              {t.plazaEmail}
            </a>
          )}
        </div>

        {onSelect && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(note);
            }}
            className="mt-3 w-full rounded-lg border border-rose-100 bg-white/75 px-3 py-2 text-[11px] font-black text-rose-700 transition hover:border-rose-200 hover:bg-rose-50 cursor-pointer"
          >
            {t.bunkaViewDetail}
          </button>
        )}
      </div>
    </article>
  );
}

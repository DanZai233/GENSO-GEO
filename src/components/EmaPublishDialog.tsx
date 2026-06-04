import React, { useState } from "react";
import { Send, X } from "lucide-react";
import { EmaNote, Language, NameEntry } from "../types";
import { publishEmaNote, getEntryName, getEntryPlace } from "../utils/emaNotes";
import { translations } from "../utils/translations";

interface EmaPublishDialogProps {
  open: boolean;
  entry: NameEntry | null;
  lang: Language;
  radiusKm: number;
  onClose: () => void;
  onPublished: (note: EmaNote) => void;
}

export default function EmaPublishDialog({ open, entry, lang, radiusKm, onClose, onPublished }: EmaPublishDialogProps) {
  const t = translations[lang];
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [publishing, setPublishing] = useState(false);

  if (!open || !entry) return null;

  const canPublish = message.trim().length >= 2 && !publishing;

  const submit = async () => {
    if (!canPublish) return;
    setPublishing(true);

    try {
      const note = await publishEmaNote({
        entry,
        message,
        email,
        radiusKm,
      });
      setMessage("");
      setEmail("");
      onPublished(note);
      onClose();
      window.alert(t.emaPublished);
    } catch (error) {
      console.error("Failed to publish ema note", error);
      window.alert(t.emaPublishFailed);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#241711]/50 p-3 backdrop-blur-sm md:items-center md:p-6">
      <div className="relative my-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#eadfca] bg-[#fffdf8] shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-800 via-amber-300 to-rose-800" />
        <div className="absolute right-5 top-12 text-8xl font-serif text-rose-900/5 select-none">願</div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-rose-100 bg-white/80 text-slate-500 shadow-sm transition hover:text-rose-700 cursor-pointer"
          aria-label="Close ema dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-5 md:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">Hakurei Shrine Ema</p>
          <h2 className="mt-2 text-2xl font-serif font-black text-slate-950">{t.emaPublishTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{t.emaPublishIntro}</p>
          <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold leading-6 text-amber-900">
            {t.emaLocalSaved}
          </p>

          <div className="mt-5 rounded-xl border border-[#eadfca] bg-[#faf7ef] p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#7c2d12]">{getEntryPlace(entry, lang)}</p>
            <h3 className="mt-1 text-xl font-serif font-black text-slate-900">{getEntryName(entry, lang)}</h3>
            {entry.fullName_romaji && <p className="mt-1 text-[11px] font-mono font-bold text-amber-800">{entry.fullName_romaji}</p>}
          </div>

          <label className="mt-5 block">
            <span className="text-xs font-black text-slate-700">{t.emaMessageLabel}</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={800}
              placeholder={t.emaMessagePlaceholder}
              className="mt-2 min-h-32 w-full resize-y rounded-xl border border-[#eadfca] bg-white p-3 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-black text-slate-700">{t.emaEmailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={160}
              placeholder={t.emaEmailPlaceholder}
              className="mt-2 w-full rounded-xl border border-[#eadfca] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none"
            />
          </label>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#eadfca] bg-white px-5 py-3 text-xs font-black text-slate-500 transition hover:text-slate-800 cursor-pointer"
            >
              {t.emaSkipPublic}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canPublish}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-700 px-5 py-3 text-xs font-black text-white shadow-lg shadow-rose-200/60 transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 cursor-pointer"
            >
              {publishing ? t.emaPublishing : t.emaPublishButton}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

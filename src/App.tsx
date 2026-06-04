import React, { useState, useEffect } from 'react';
import { ViewMode, NameEntry, Language, EmaNote } from './types';
import MapView from './components/MapView';
import CollectionView from './components/CollectionView';
import Navbar from './components/Navbar';
import OnboardingGuide from './components/OnboardingGuide';
import EmaPlazaView from './components/EmaPlazaView';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [collection, setCollection] = useState<NameEntry[]>([]);
  const [focusNote, setFocusNote] = useState<EmaNote | null>(null);
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('user-selected-language') as Language) || 'zh';
  });
  const [guideOpen, setGuideOpen] = useState(() => {
    return localStorage.getItem('genso-geo-guide-seen') !== 'true';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('user-selected-language', newLang);
  };

  const closeGuide = () => {
    setGuideOpen(false);
    localStorage.setItem('genso-geo-guide-seen', 'true');
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('geo-names-collection');
      if (saved) {
        setCollection(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load collection');
    }
  }, []);

  const saveToCollection = (entry: NameEntry) => {
    const updated = [entry, ...collection];
    setCollection(updated);
    localStorage.setItem('geo-names-collection', JSON.stringify(updated));
  };
  
  const removeFromCollection = (id: string) => {
    const updated = collection.filter(c => c.id !== id);
    setCollection(updated);
    localStorage.setItem('geo-names-collection', JSON.stringify(updated));
  };

  const goToMap = (note?: EmaNote) => {
    setFocusNote(note || null);
    setViewMode('map');
  };

  return (
    <div className="min-h-dvh md:h-dvh bg-[#F7F6F2] text-slate-800 flex flex-col font-sans overflow-y-auto md:overflow-hidden">
      <Navbar 
        viewMode={viewMode} 
        setViewMode={(mode) => {
          if (mode === 'map') setFocusNote(null);
          setViewMode(mode);
        }}
        collectionCount={collection.length} 
        lang={lang} 
        setLang={setLang} 
        openGuide={() => setGuideOpen(true)}
      />
      
      <main className="flex-1 relative overflow-visible md:overflow-hidden flex flex-col md:min-h-0">
        {viewMode === 'map' ? (
          <MapView lang={lang} onSave={saveToCollection} focusNote={focusNote} />
        ) : viewMode === 'collection' ? (
          <CollectionView lang={lang} collection={collection} onRemove={removeFromCollection} />
        ) : (
          <EmaPlazaView lang={lang} goToMap={goToMap} />
        )}
      </main>

      <OnboardingGuide open={guideOpen} lang={lang} setLang={setLang} onClose={closeGuide} />
    </div>
  );
}

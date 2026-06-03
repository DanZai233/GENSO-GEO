import React, { useState, useEffect } from 'react';
import { ViewMode, NameEntry, Language } from './types';
import MapView from './components/MapView';
import CollectionView from './components/CollectionView';
import Navbar from './components/Navbar';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [collection, setCollection] = useState<NameEntry[]>([]);
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('user-selected-language') as Language) || 'zh';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('user-selected-language', newLang);
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

  return (
    <div className="h-screen bg-[#F7F6F2] text-slate-800 flex flex-col font-sans overflow-hidden">
      <Navbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        collectionCount={collection.length} 
        lang={lang} 
        setLang={setLang} 
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {viewMode === 'map' ? (
          <MapView lang={lang} onSave={saveToCollection} />
        ) : (
          <CollectionView lang={lang} collection={collection} onRemove={removeFromCollection} />
        )}
      </main>
    </div>
  );
}

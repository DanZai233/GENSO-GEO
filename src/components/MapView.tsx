import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NameEntry, Language } from '../types';
import { Loader2, Sparkles, MapPin, Compass } from 'lucide-react';
import { translations } from '../utils/translations';

interface MapViewProps {
  onSave: (entry: NameEntry) => void;
  lang: Language;
}

// Preset Premium Locations across Japan
const REGIONAL_DATABASE = [
  { name: 'Kiyomizu-dera, Kyoto', lat: 34.9948, lng: 135.7850, country: 'Japan', type: 'Kyoto Special' },
  { name: 'Arashiyama Forest, Kyoto', lat: 35.0156, lng: 135.6715, country: 'Japan', type: 'Kyoto Special' },
  { name: 'Shinjuku Gyoen, Tokyo', lat: 35.6852, lng: 139.7101, country: 'Japan', type: 'Kanto Capital' },
  { name: 'Akihabara Tech Town, Tokyo', lat: 35.6997, lng: 139.7719, country: 'Japan', type: 'Kanto Capital' },
  { name: 'Yuigahama Coast, Kamakura', lat: 35.3082, lng: 139.5422, country: 'Japan', type: 'Kamakura District' },
  { name: 'Gokurakuji Temple, Kamakura', lat: 35.3093, lng: 139.5284, country: 'Japan', type: 'Kamakura District' },
  { name: 'Historic Shirakawa-go, Gifu', lat: 36.2562, lng: 136.9060, country: 'Japan', type: 'Traditional Village' },
  { name: 'Lake Suwa Shrine, Nagano', lat: 36.0461, lng: 138.1064, country: 'Japan', type: 'Folkloric Lake' },
  { name: 'Fuji Summit, Yamanashi', lat: 35.3606, lng: 138.7274, country: 'Japan', type: 'Holy Mountain' },
  { name: 'Itsukushima Tori, Hiroshima', lat: 34.2960, lng: 132.3211, country: 'Japan', type: 'Scenic Shrine' },
  { name: 'Otaru Blue Canal, Hokkaido', lat: 43.1907, lng: 141.0064, country: 'Japan', type: 'Hokkaido North' },
  { name: 'Dotonbori Neon, Osaka', lat: 34.6687, lng: 135.5013, country: 'Japan', type: 'Kansai Hub' },
  { name: 'Senso-ji Asakusa, Tokyo', lat: 35.7148, lng: 139.7967, country: 'Japan', type: 'Old Tokyo' },
  { name: 'Nikko Ancient Forest, Tochigi', lat: 36.7581, lng: 139.5989, country: 'Japan', type: 'Mystery Woods' },
  { name: 'Hakone Hot Springs, Kanagawa', lat: 35.2324, lng: 139.1069, country: 'Japan', type: 'Volcanic valley' },
  { name: 'Matsumoto Imperial Castle, Nagano', lat: 36.2380, lng: 137.9691, country: 'Japan', type: 'Castle Town' }
];

export default function MapView({ onSave, lang }: MapViewProps) {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedName, setGeneratedName] = useState<NameEntry | null>(null);
  const [placeInfo, setPlaceInfo] = useState<{ name: string, country: string, type: string } | null>(null);

  const [geoRange, setGeoRange] = useState<'national' | 'kanto' | 'custom'>('national');
  const [characterStyle, setCharacterStyle] = useState<'academic' | 'noble' | 'modern' | 'historical'>('modern');

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use lightweight aesthetic map tiles to prevent CSP violations or offline bugs
    const mapStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© CartoDB'
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [139.6917, 35.6895], // Tokyo center
      zoom: 6
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-left');
    
    mapRef.current = map;

    // Click handler for custom spot selection
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      triggerLookup(lat, lng);
    });

    // Handle layout container resizing
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  // Run generation for a given coordinate
  const triggerLookup = async (lat: number, lng: number, overridePlace?: { name: string, country: string, type: string }) => {
    setSelectedLocation({ lat, lng });
    setGeneratedName(null);
    setLoading(true);

    // Place Marker dynamically
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      const el = document.createElement('div');
      el.className = 'custom-pulse-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.background = '#e11d48';
      el.style.border = '3px solid #ffffff';
      el.style.boxShadow = '0 0 15px rgba(225, 29, 72, 0.6)';
      el.style.animation = 'pulse-ring 1.5s infinite';

      const customStyle = document.createElement('style');
      customStyle.innerHTML = `
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
      `;
      document.head.appendChild(customStyle);

      markerRef.current = new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Smoothly pan map to selected location
      mapRef.current.easeTo({
        center: [lng, lat],
        zoom: Math.max(mapRef.current.getZoom(), 8),
        duration: 1200
      });
    }

    try {
      let placeName = 'Custom Marker';
      let country = 'Japan';
      let locationType = 'Location';

      if (overridePlace) {
        placeName = overridePlace.name;
        country = overridePlace.country;
        locationType = overridePlace.type;
      } else {
        // Fetch real Reverse Geocoding details from OpenStreetMap Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh,ja,en`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            placeName = data.display_name || 'Scenic Point';
            const address = data.address || {};
            country = address.country || 'Japan';

            // Deduce a clean location label
            locationType = address.suburb || address.city_district || address.town || address.county || address.state || 'Area Resonance';
          }
        }
      }

      setPlaceInfo({ name: placeName, country, type: locationType });

      // Call Gemini model back-end to generate styled character description/name
      const apiRes = await fetch('/api/generate-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          placeName,
          country,
          locationType: `${locationType} (${characterStyle} style)`
        })
      });

      if (!apiRes.ok) throw new Error("Generation error");

      const generatedData = await apiRes.json();

      setGeneratedName({
        id: crypto.randomUUID(),
        placeName,
        country,
        createdAt: Date.now(),
        ...generatedData
      });

    } catch (err) {
      console.error(err);
      alert(t.alertError);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomGenerate = () => {
    // Select based on active filter
    let pool = REGIONAL_DATABASE;
    if (geoRange === 'kanto') {
      pool = REGIONAL_DATABASE.filter(item => item.type.includes('Kanto') || item.name.includes('Tokyo') || item.type.includes('Kamakura'));
    }

    const index = Math.floor(Math.random() * pool.length);
    const place = pool[index];

    // Give a minor random coordinate shake to represent real regional variation
    const offsetLat = place.lat + (Math.random() - 0.5) * 0.05;
    const offsetLng = place.lng + (Math.random() - 0.5) * 0.05;

    triggerLookup(offsetLat, offsetLng, {
      name: place.name.split(',')[0],
      country: place.country,
      type: place.type
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full">
      
      {/* Left Sidebar: Filter controls styled according to target theme */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0">
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <section>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t.geoRange}</h3>
            <div className="space-y-2">
              <label 
                onClick={() => setGeoRange('national')}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${geoRange === 'national' ? 'border-rose-100 bg-rose-55/70 text-rose-900 font-medium' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${geoRange === 'national' ? 'border-rose-600' : 'border-slate-300'}`}>
                  {geoRange === 'national' && <div className="w-2 h-2 rounded-full bg-rose-600" />}
                </div>
                <span className="text-sm font-medium">{t.geoNational}</span>
              </label>

              <label 
                onClick={() => setGeoRange('kanto')}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${geoRange === 'kanto' ? 'border-rose-100 bg-rose-55/70 text-rose-900 font-medium' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${geoRange === 'kanto' ? 'border-rose-600' : 'border-slate-300'}`}>
                  {geoRange === 'kanto' && <div className="w-2 h-2 rounded-full bg-rose-600" />}
                </div>
                <span className="text-sm font-medium">{t.geoKanto}</span>
              </label>

              <label 
                onClick={() => setGeoRange('custom')}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${geoRange === 'custom' ? 'border-rose-100 bg-rose-55/70 text-rose-900 font-medium' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${geoRange === 'custom' ? 'border-rose-600' : 'border-slate-300'}`}>
                  {geoRange === 'custom' && <div className="w-2 h-2 rounded-full bg-rose-600" />}
                </div>
                <span className="text-sm font-medium">{t.geoCustom}</span>
              </label>
            </div>
          </section>

          <section>
            <h3 className="text.[11px] font-bold text-slate-400 tracking-widest mb-4 uppercase">{t.stylePreset}</h3>
            <select 
              value={characterStyle}
              onChange={(e) => setCharacterStyle(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-rose-400"
            >
              <option value="modern">{t.styleModern}</option>
              <option value="academic">{t.styleAcademic}</option>
              <option value="noble">{t.styleNoble}</option>
              <option value="historical">{t.styleHistorical}</option>
            </select>
          </section>

          <button 
            onClick={handleRandomGenerate}
            className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2 tracking-wider select-none cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>{t.btnRandom}</span>
          </button>
        </div>

        {selectedLocation && (
          <div className="p-4 border-t border-slate-100 shrink-0">
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <p className="text-[10px] opacity-70 mb-1 tracking-widest uppercase">{t.mapActive}</p>
              <p className="text-xs font-mono tracking-tighter italic">LAT: {selectedLocation.lat.toFixed(4)} / LONG: {selectedLocation.lng.toFixed(4)}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Interactive Map wrapper */}
      <section className="flex-1 flex flex-col relative h-full">
        <div ref={mapContainerRef} className="flex-1 w-full h-full bg-[#EAE9E4]" />

        {/* Float guidance overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-slate-200/50 flex items-center gap-3 pointer-events-none z-10">
          <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
          <span className="font-bold text-xs tracking-wider text-slate-700 uppercase">{t.tipClickMap}</span>
        </div>

        {/* Generation Bottom Drawer Outcome */}
        {(selectedLocation || loading) && (
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border border-rose-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 transition-all duration-300">
            {loading ? (
              <div className="flex items-center gap-3 text-rose-600 p-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-sm font-bold tracking-wider animate-pulse">{t.loadingText}</p>
              </div>
            ) : generatedName ? (
              <>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-3">
                    <h2 className="text-4xl font-serif font-black tracking-tighter text-slate-900">
                      {lang === 'zh' 
                        ? (generatedName.fullName_zh || generatedName.fullName) 
                        : lang === 'ja'
                        ? (generatedName.fullName_ja || generatedName.fullName)
                        : (generatedName.fullName_en || generatedName.fullName)}
                    </h2>
                    <span className="text-sm font-light text-slate-400 font-sans font-medium">
                      {lang === 'zh' 
                        ? `${generatedName.lastName_zh || generatedName.lastName || ''}${generatedName.firstName_zh || generatedName.firstName || ''}`
                        : lang === 'ja'
                        ? `${generatedName.fullName_ja || ''}`
                        : `${generatedName.firstName_en || generatedName.firstName || ''} ${generatedName.lastName_en || generatedName.lastName || ''}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-3 flex-wrap gap-y-2">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded uppercase tracking-widest border border-rose-100">
                      {t.originLabel}: {lang === 'zh' 
                        ? (generatedName.placeName_zh || generatedName.placeName).split(',')[0]
                        : lang === 'ja'
                        ? (generatedName.placeName_ja || generatedName.placeName).split(',')[0]
                        : (generatedName.placeName_en || generatedName.placeName).split(',')[0]}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded uppercase tracking-widest border border-amber-100">
                      {t.typeLabel}: {lang === 'zh' 
                        ? (generatedName.characterArchetype_zh || generatedName.characterArchetype)
                        : lang === 'ja'
                        ? (generatedName.characterArchetype_ja || generatedName.characterArchetype)
                        : (generatedName.characterArchetype_en || generatedName.characterArchetype)}
                    </span>
                    <span className="text-xs text-slate-500 italic font-medium leading-relaxed">
                      {t.inspirationLabel}: {lang === 'zh' 
                        ? (generatedName.inspiration_zh || generatedName.inspiration)
                        : lang === 'ja'
                        ? (generatedName.inspiration_ja || generatedName.inspiration)
                        : (generatedName.inspiration_en || generatedName.inspiration)}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 shrink-0 self-stretch md:self-auto justify-end">
                   <button 
                     onClick={() => {
                       onSave(generatedName);
                       alert(t.alertSaved);
                     }}
                     className="px-6 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer select-none"
                   >
                     {t.btnAddCollection}
                   </button>
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-sm italic">
                {lang === 'zh' ? '点击地图或点击随机检索以查看地理共鸣机制...' : 'Tap on the map or trigger random search to inspect coordinate resonance...'}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

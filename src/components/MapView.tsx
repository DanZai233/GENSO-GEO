import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NameEntry, Language } from '../types';
import { Loader2, Sparkles, MapPin, Compass, Flame, BookOpen, Send, Globe } from 'lucide-react';
import { translations } from '../utils/translations';
import EmaNoteCard from './EmaNoteCard';
import EmaPublishDialog from './EmaPublishDialog';
import { EmaNote } from '../types';
import { fetchNearbyEmaNotes } from '../utils/emaNotes';

interface MapViewProps {
  onSave: (entry: NameEntry) => void;
  lang: Language;
}

type PlaceOverride = { name: string, country: string, type: string };

// Highly enriched landmarks database across multiple countries/themes (Japan, China, Europe, USA)
const REGIONAL_DATABASE = [
  // Japan (日本本州)
  { name: 'Kiyomizu-dera, Kyoto', lat: 34.9948, lng: 135.7850, country: 'Japan', type: 'Kyoto Sanctuary' },
  { name: 'Arashiyama Forest, Kyoto', lat: 35.0156, lng: 135.6715, country: 'Japan', type: 'Folkloric Woods' },
  { name: 'Shinjuku Gyoen, Tokyo', lat: 35.6852, lng: 139.7101, country: 'Japan', type: 'Kanto Capital' },
  { name: 'Akihabara Tech Town, Tokyo', lat: 35.6997, lng: 139.7719, country: 'Japan', type: 'Kanto Electric Town' },
  { name: 'Yuigahama Coast, Kamakura', lat: 35.3082, lng: 139.5422, country: 'Japan', type: 'Kamakura Coastline' },
  { name: 'Gokurakuji Temple, Kamakura', lat: 35.3093, lng: 139.5284, country: 'Japan', type: 'Ancient Temple' },
  { name: 'Historic Shirakawa-go, Gifu', lat: 36.2562, lng: 136.9060, country: 'Japan', type: 'Snowy Mystic Village' },
  { name: 'Lake Suwa Shrine, Nagano', lat: 36.0461, lng: 138.1064, country: 'Japan', type: 'Dragon God Waters' },
  { name: 'Fuji Summit, Yamanashi', lat: 35.3606, lng: 138.7274, country: 'Japan', type: 'Holy Mountain of Japan' },
  { name: 'Itsukushima Shrine, Hiroshima', lat: 34.2960, lng: 132.3211, country: 'Japan', type: 'Maritime Torii' },
  { name: 'Otaru Blue Canal, Hokkaido', lat: 43.1907, lng: 141.0064, country: 'Japan', type: 'Northern Lights Port' },
  { name: 'Dotonbori Neon, Osaka', lat: 34.6687, lng: 135.5013, country: 'Japan', type: 'Kansai Metropolis' },
  { name: 'Senso-ji Asakusa, Tokyo', lat: 35.7148, lng: 139.7967, country: 'Japan', type: 'Old Edo Outpost' },

  // China (华夏神州古代名胜)
  { name: 'West Lake, Hangzhou', lat: 30.2440, lng: 120.1430, country: 'China', type: 'Mystic Serene Lake' },
  { name: 'Forbidden City, Beijing', lat: 39.9163, lng: 116.3972, country: 'China', type: 'Imperial Purple Palace' },
  { name: 'Yellow Mountain, Anhui', lat: 30.1299, lng: 118.1751, country: 'China', type: 'Taoist Cloud Peaks' },
  { name: 'Suzhou Classical Garden, Jiangsu', lat: 31.3204, lng: 120.6133, country: 'China', type: 'Quiet Scholar Pond' },
  { name: 'Potala Palace, Lhasa', lat: 29.6577, lng: 91.1172, country: 'China', type: 'Sacred High Sanctuary' },
  { name: 'Jiuzhaigou Pools, Sichuan', lat: 33.2613, lng: 103.9186, country: 'China', type: 'Rainbow Colored Basin' },
  { name: 'Mount Tai Divine Summit, Shandong', lat: 36.2555, lng: 117.1002, country: 'China', type: 'Sacred Heavenly Summit' },

  // Europe (西方悠久圣域 / UK, France, Germany, Italy, Greece)
  { name: 'Westminster Abbey, London', lat: 51.4994, lng: -0.1273, country: 'United Kingdom', type: 'Gothic Cathedral' },
  { name: 'Stonehenge, Wiltshire', lat: 51.1789, lng: -1.8262, country: 'United Kingdom', type: 'Prehistoric Druid Circle' },
  { name: 'Eiffel Tower, Paris', lat: 48.8584, lng: 2.2945, country: 'France', type: 'Neo-Gothic Steel Spires' },
  { name: 'Mont Saint-Michel Abbey, Normandy', lat: 48.6360, lng: -1.5114, country: 'France', type: 'Tidal Island Citadel' },
  { name: 'Black Forest, Baden-Württemberg', lat: 48.0667, lng: 8.2167, country: 'Germany', type: 'Grimm Dark Witchwood' },
  { name: 'Colosseum Ruins, Rome', lat: 41.8902, lng: 12.4922, country: 'Italy', type: 'Imperial Gladiatorial Ring' },
  { name: 'Parthenon Temple, Athens', lat: 37.9715, lng: 23.7266, country: 'Greece', type: 'Pantheon of Gods' },

  // North America (北美外来地脉)
  { name: 'Grand Canyon, Arizona', lat: 36.0544, lng: -112.1401, country: 'United States', type: 'Crimson Earth Canyons' },
  { name: 'Yellowstone Caldera, Wyoming', lat: 44.4280, lng: -110.5885, country: 'United States', type: 'Mystical Geyser Well' },
  { name: 'Times Square Crossroads, New York', lat: 40.7580, lng: -73.9855, country: 'United States', type: 'Techno-Magic Crossroads' },
  { name: 'Salem Woods, Massachusetts', lat: 42.5195, lng: -70.8967, country: 'United States', type: 'Witchcraft Assembly Woods' }
];

function PrayerLoading({ title, message, hint }: { title: string; message: string; hint: string }) {
  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-rose-100 bg-[#fffdfa] p-4 md:p-5 shadow-inner">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-700 via-amber-400 to-rose-700" />
      <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(135deg,#7f1d1d_0,#7f1d1d_1px,transparent_1px,transparent_16px)] pointer-events-none" />
      <div className="relative flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 rounded-full border border-rose-100 bg-[#f8f3e8] shadow-sm grid place-items-center">
          <div className="absolute inset-1 rounded-full border border-dashed border-rose-300 animate-spin [animation-duration:5s]" />
          <img src="/logo.svg" alt="" className="h-10 w-10 object-contain drop-shadow-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black text-rose-700 uppercase">GENSO-GEO</p>
          <h3 className="mt-1 text-xl md:text-2xl font-serif font-black text-slate-900 tracking-normal">
            {title}
          </h3>
          <p className="mt-1 text-xs md:text-sm font-bold text-[#7c2d12] leading-relaxed">
            {message}
          </p>
          <p className="mt-1 text-[10px] md:text-xs text-slate-500">
            {hint}
          </p>
        </div>
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-rose-100">
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-rose-700 via-amber-400 to-rose-700 animate-prayer-sweep" />
      </div>
    </div>
  );
}

export default function MapView({ onSave, lang }: MapViewProps) {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const emaMarkerRefs = useRef<maplibregl.Marker[]>([]);
  const generationInFlightRef = useRef(false);
  const searchInFlightRef = useRef(false);
  const triggerLookupRef = useRef<(lat: number, lng: number, overridePlace?: PlaceOverride) => void>(() => {});

  // View state & tab settings (Map Pinning vs Narrative Description Resonance)
  const [activeTab, setActiveTab] = useState<'map' | 'desc'>('map');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedName, setGeneratedName] = useState<NameEntry | null>(null);
  const [placeInfo, setPlaceInfo] = useState<{ name: string, country: string, type: string } | null>(null);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(100);
  const [nearbyNotes, setNearbyNotes] = useState<EmaNote[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [selectedEmaNote, setSelectedEmaNote] = useState<EmaNote | null>(null);
  const [publishEntry, setPublishEntry] = useState<NameEntry | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // Fated Backtrack logs (session history for undo/redo clicks)
  const [generationHistory, setGenerationHistory] = useState<NameEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Custom filters
  const [geoRange, setGeoRange] = useState<'national' | 'kanto' | 'china' | 'europe' | 'america' | 'custom'>('national');
  const [characterStyle, setCharacterStyle] = useState<'modern' | 'academic' | 'noble' | 'historical' | 'yokai' | 'shrine' | 'ghost' | 'celestial'>('shrine');
  
  // Custom description inputs for new features
  const [description, setDescription] = useState('');

  // Map geocoding search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingMap, setSearchingMap] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const loadNearbyNotes = async (lat: number, lng: number, radiusKm = nearbyRadiusKm) => {
    setNearbyLoading(true);
    try {
      const notes = await fetchNearbyEmaNotes(lat, lng, radiusKm);
      setNearbyNotes(notes);
    } catch (error) {
      console.error("Failed to load nearby ema notes", error);
      setNearbyNotes([]);
    } finally {
      setNearbyLoading(false);
    }
  };

  const beginGeneration = () => {
    if (generationInFlightRef.current) return false;
    generationInFlightRef.current = true;
    setLoading(true);
    return true;
  };

  const endGeneration = () => {
    generationInFlightRef.current = false;
    setLoading(false);
  };

  // Initialize MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Quiet minimalist light-golden-parchment raster style to stay beautifully in Eastern Touhou theme
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
      center: [139.6917, 35.6895], // Start central Japan
      zoom: 5
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-left');
    mapRef.current = map;

    // Handle clicks
    map.on('click', (e) => {
      if (generationInFlightRef.current) return;
      const { lng, lat } = e.lngLat;
      triggerLookupRef.current(lat, lng);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  // Sync map view when the selected geo level switches
  useEffect(() => {
    if (!mapRef.current) return;
    if (geoRange === 'national' || geoRange === 'kanto') {
      mapRef.current.easeTo({ center: [139.6917, 35.6895], zoom: 5, duration: 1000 });
    } else if (geoRange === 'china') {
      mapRef.current.easeTo({ center: [116.4074, 39.9042], zoom: 4, duration: 1000 });
    } else if (geoRange === 'europe') {
      mapRef.current.easeTo({ center: [2.2945, 48.8584], zoom: 4, duration: 1000 });
    } else if (geoRange === 'america') {
      mapRef.current.easeTo({ center: [-95.7129, 37.0902], zoom: 4, duration: 1000 });
    }
  }, [geoRange]);

  useEffect(() => {
    emaMarkerRefs.current.forEach((marker) => marker.remove());
    emaMarkerRefs.current = [];

    if (!mapRef.current) return;

    nearbyNotes.forEach((note) => {
      if (typeof note.lat !== "number" || typeof note.lng !== "number") return;

      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.className = "genso-ema-marker";
      markerEl.textContent = "絵";
      markerEl.title = note.message;
      markerEl.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelectedEmaNote(note);
      });

      const marker = new maplibregl.Marker(markerEl)
        .setLngLat([note.lng, note.lat])
        .addTo(mapRef.current!);

      emaMarkerRefs.current.push(marker);
    });

    return () => {
      emaMarkerRefs.current.forEach((marker) => marker.remove());
      emaMarkerRefs.current = [];
    };
  }, [nearbyNotes]);

  // Backtrack History Helpers
  const addEntryToHistory = (newEntry: NameEntry) => {
    setGenerationHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, newEntry];
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  useEffect(() => {
    if (!selectedLocation) {
      setNearbyNotes([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadNearbyNotes(selectedLocation.lat, selectedLocation.lng, nearbyRadiusKm);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [selectedLocation?.lat, selectedLocation?.lng, nearbyRadiusKm]);

  const handleBacktrackPrev = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const prevEntry = generationHistory[prevIdx];
      setGeneratedName(prevEntry);
      
      if (prevEntry.lat !== undefined && prevEntry.lng !== undefined) {
        setSelectedLocation({ lat: prevEntry.lat, lng: prevEntry.lng });
        setPlaceInfo({
          name: prevEntry.placeName,
          country: prevEntry.country,
          type: prevEntry.characterArchetype_zh || prevEntry.characterArchetype || 'Anchor'
        });
        
        if (mapRef.current) {
          if (markerRef.current) markerRef.current.remove();
          
          const markerEl = document.createElement('div');
          markerEl.style.width = '28px';
          markerEl.style.height = '28px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.background = '#f43f5e';
          markerEl.style.border = '4px solid #fffdfa';
          markerEl.style.boxShadow = '0 0 16px rgba(244, 63, 94, 0.9)';
          markerEl.style.animation = 'marker-pulse 1.4s infinite ease-in-out';
          
          markerRef.current = new maplibregl.Marker(markerEl)
            .setLngLat([prevEntry.lng, prevEntry.lat])
            .addTo(mapRef.current);

          mapRef.current.easeTo({
            center: [prevEntry.lng, prevEntry.lat],
            zoom: Math.max(mapRef.current.getZoom(), 7),
            duration: 800
          });
        }
      }
    }
  };

  const handleBacktrackNext = () => {
    if (historyIndex < generationHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const nextEntry = generationHistory[nextIdx];
      setGeneratedName(nextEntry);
      
      if (nextEntry.lat !== undefined && nextEntry.lng !== undefined) {
        setSelectedLocation({ lat: nextEntry.lat, lng: nextEntry.lng });
        setPlaceInfo({
          name: nextEntry.placeName,
          country: nextEntry.country,
          type: nextEntry.characterArchetype_zh || nextEntry.characterArchetype || 'Anchor'
        });
        
        if (mapRef.current) {
          if (markerRef.current) markerRef.current.remove();
          
          const markerEl = document.createElement('div');
          markerEl.style.width = '28px';
          markerEl.style.height = '28px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.background = '#f43f5e';
          markerEl.style.border = '4px solid #fffdfa';
          markerEl.style.boxShadow = '0 0 16px rgba(244, 63, 94, 0.9)';
          markerEl.style.animation = 'marker-pulse 1.4s infinite ease-in-out';
          
          markerRef.current = new maplibregl.Marker(markerEl)
            .setLngLat([nextEntry.lng, nextEntry.lat])
            .addTo(mapRef.current);

          mapRef.current.easeTo({
            center: [nextEntry.lng, nextEntry.lat],
            zoom: Math.max(mapRef.current.getZoom(), 7),
            duration: 800
          });
        }
      }
    }
  };

  // Execute geographical coordinate lookup
  const triggerLookup = async (lat: number, lng: number, overridePlace?: PlaceOverride) => {
    if (!beginGeneration()) return;
    setSelectedLocation({ lat, lng });
    setGeneratedName(null);

    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Torii Red Talisman ripple effect marker
      const markerEl = document.createElement('div');
      markerEl.className = 'touhou-talisman-marker';
      markerEl.style.width = '28px';
      markerEl.style.height = '28px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.background = '#f43f5e';
      markerEl.style.border = '4px solid #fffdfa';
      markerEl.style.boxShadow = '0 0 16px rgba(244, 63, 94, 0.9)';
      markerEl.style.cursor = 'pointer';
      markerEl.style.animation = 'marker-pulse 1.4s infinite ease-in-out';

      const pulseStyle = document.createElement('style');
      pulseStyle.innerHTML = `
        @keyframes marker-pulse {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.8); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 12px rgba(244, 63, 94, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
      `;
      document.head.appendChild(pulseStyle);

      markerRef.current = new maplibregl.Marker(markerEl)
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      mapRef.current.easeTo({
        center: [lng, lat],
        zoom: Math.max(mapRef.current.getZoom(), 7),
        duration: 1100
      });
    }

    try {
      let placeName = 'Custom Boundary Node';
      let country = 'Japan';
      let locationType = 'Spiritual Nexus';

      if (overridePlace) {
        placeName = overridePlace.name;
        country = overridePlace.country;
        locationType = overridePlace.type;
      } else {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh,ja,en`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            placeName = data.display_name?.split(',')[0] || 'Aether Intersection';
            const address = data.address || {};
            country = address.country || 'Japan';
            locationType = address.suburb || address.city_district || address.town || address.state || 'Leyline node';
          }
        }
      }

      setPlaceInfo({ name: placeName, country, type: locationType });
      setSelectedEmaNote(null);

      const apiRes = await fetch('/api/generate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName,
          country,
          locationType: `${locationType} (${characterStyle} vibe)`
        })
      });

      if (!apiRes.ok) throw new Error("Gensokyo API Error");
      const generatedData = await apiRes.json();

      const finalEntry = {
        id: crypto.randomUUID(),
        placeName,
        country,
        createdAt: Date.now(),
        lat,
        lng,
        ...generatedData
      };

      setGeneratedName(finalEntry);
      addEntryToHistory(finalEntry);
      void loadNearbyNotes(lat, lng);
    } catch (err) {
      console.error(err);
      alert(t.alertError);
    } finally {
      endGeneration();
    }
  };

  triggerLookupRef.current = triggerLookup;

  // Perform specific descriptive/narrative lookup
  const triggerDescriptionResonance = async () => {
    if (generationInFlightRef.current) return;
    if (!description.trim()) {
      alert(lang === 'zh' ? '请填写角色描述！' : lang === 'ja' ? 'キャラクターの説明を入力してください！' : 'Please provide character descriptions!');
      return;
    }
    if (!beginGeneration()) return;

    setGeneratedName(null);

    // Pick a regional anchor from the selected geo pool to weave into geography
    let pool = REGIONAL_DATABASE;
    if (geoRange === 'kanto') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'Japan' && (item.type.includes('Kanto') || item.name.includes('Tokyo')));
    } else if (geoRange === 'national') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'Japan');
    } else if (geoRange === 'china') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'China');
    } else if (geoRange === 'europe') {
      pool = REGIONAL_DATABASE.filter(item => item.country !== 'Japan' && item.country !== 'China' && item.country !== 'United States');
    } else if (geoRange === 'america') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'United States');
    }

    const randomAnchor = pool[Math.floor(Math.random() * pool.length)];
    const filterPlaceName = placeInfo?.name || randomAnchor.name.split(',')[0];
    const filterCountry = placeInfo?.country || randomAnchor.country;
    const filterLocationType = placeInfo?.type || randomAnchor.type;

    try {
      const apiRes = await fetch('/api/generate-description-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          characterStyle,
          placeName: filterPlaceName,
          country: filterCountry,
          locationType: filterLocationType
        })
      });

      if (!apiRes.ok) throw new Error("Gensokyo Description API Error");
      const generatedData = await apiRes.json();

      // Pan to the selected background node if using coordinates
      if (!placeInfo && mapRef.current) {
        mapRef.current.easeTo({
          center: [randomAnchor.lng, randomAnchor.lat],
          zoom: 7,
          duration: 900
        });

        // Add a glowing talisman marker at that anchor
        if (markerRef.current) markerRef.current.remove();
        const markerEl = document.createElement('div');
        markerEl.style.width = '32px';
        markerEl.style.height = '32px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.background = '#d97706';
        markerEl.style.border = '4px solid #fffdfa';
        markerEl.style.boxShadow = '0 0 18px rgba(217, 119, 6, 0.9)';
        markerEl.style.animation = 'marker-pulse 1.4s infinite ease-in-out';
        
        markerRef.current = new maplibregl.Marker(markerEl)
          .setLngLat([randomAnchor.lng, randomAnchor.lat])
          .addTo(mapRef.current);
      }

      const targetLat = selectedLocation?.lat ?? randomAnchor.lat;
      const targetLng = selectedLocation?.lng ?? randomAnchor.lng;

      const finalEntry = {
        id: crypto.randomUUID(),
        placeName: filterPlaceName,
        country: filterCountry,
        createdAt: Date.now(),
        lat: targetLat,
        lng: targetLng,
        ...generatedData
      };

      setGeneratedName(finalEntry);
      addEntryToHistory(finalEntry);
      void loadNearbyNotes(targetLat, targetLng);

    } catch (err) {
      console.error(err);
      alert(t.alertError);
    } finally {
      endGeneration();
    }
  };

  // Peeking border gap (Random Map selection)
  const handleRandomGenerate = () => {
    if (generationInFlightRef.current) return;
    let pool = REGIONAL_DATABASE;
    if (geoRange === 'kanto') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'Japan' && (item.type.includes('Kanto') || item.name.includes('Tokyo') || item.type.includes('Kamakura')));
    } else if (geoRange === 'national') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'Japan');
    } else if (geoRange === 'china') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'China');
    } else if (geoRange === 'europe') {
      pool = REGIONAL_DATABASE.filter(item => item.country !== 'Japan' && item.country !== 'China' && item.country !== 'United States');
    } else if (geoRange === 'america') {
      pool = REGIONAL_DATABASE.filter(item => item.country === 'United States');
    }

    const index = Math.floor(Math.random() * pool.length);
    const place = pool[index];

    const offsetLat = place.lat + (Math.random() - 0.5) * 0.04;
    const offsetLng = place.lng + (Math.random() - 0.5) * 0.04;

    triggerLookup(offsetLat, offsetLng, {
      name: place.name.split(',')[0],
      country: place.country,
      type: place.type
    });
  };

  // Search submit handler using OpenStreetMap Nominatim Free Search API
  const handleSearchSubmit = async () => {
    if (generationInFlightRef.current || searchInFlightRef.current) return;
    if (!searchQuery.trim()) return;
    searchInFlightRef.current = true;
    setSearchingMap(true);
    setSearchResults([]);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&accept-language=zh,ja,en`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data || []);
        if (data && data.length === 0) {
          alert(lang === 'zh' 
            ? '大结界未探测到对应尘世灵脉，请试着换个地名吧' 
            : lang === 'ja' 
            ? '大結界が該当する現世の霊脈を検出できませんでした' 
            : 'No spiritual coordinates detected for this location. Please try another placename.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      searchInFlightRef.current = false;
      setSearchingMap(false);
    }
  };

  // When a search result option is clicked, teleport to coordinates and trigger generator
  const handleSelectSearchResult = (result: any) => {
    if (generationInFlightRef.current) return;
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    const displayName = result.display_name || '';
    const parts = displayName.split(',');
    const name = parts[0] || 'Tuned Node';
    const country = parts[parts.length - 1]?.trim() || 'Japan';
    const type = parts[1]?.trim() || 'Aether Intersection';

    setSearchResults([]);
    setSearchQuery(name);

    triggerLookup(lat, lng, {
      name,
      country,
      type
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-visible md:overflow-hidden w-full h-auto md:h-full bg-[#fcfbf9] relative">
      
      {/* Decorative Traditional Border ornaments */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-800 z-30 opacity-70 hidden md:block" />
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-red-800 z-30 opacity-70 hidden md:block" />

      {/* Eastern Talisman Inspired Sidebar */}
      <aside className="order-2 md:order-1 w-full md:w-96 h-auto md:h-full bg-[#fdfcf7] border-t md:border-t-0 md:border-r border-[#e9e4d9] flex flex-col shrink-0 shadow-xl overflow-visible md:overflow-hidden relative z-20">
        
        {/* Subtle clouds background or floral stamp */}
        <div className="absolute top-3 right-4 opacity-5 pointer-events-none select-none text-[84px]">
          ☯
        </div>

        {/* Tab switcher: Map Leylines vs Desc Narrative */}
        <div className="flex border-b border-[#e9e4d9] bg-[#f7f5ed] shrink-0 p-1">
          <button
            onClick={() => setActiveTab('map')}
            disabled={loading}
            className={`flex-1 py-3 text-xs font-bold tracking-widest text-center transition-all rounded-md flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${activeTab === 'map' ? 'bg-white text-rose-700 shadow-sm border border-[#e2dcce]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>🏮</span> {lang === 'zh' ? '灵脉地图定位' : lang === 'ja' ? '霊脈地図' : 'Map Leylines'}
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            disabled={loading}
            className={`flex-1 py-3 text-xs font-bold tracking-widest text-center transition-all rounded-md flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${activeTab === 'desc' ? 'bg-white text-rose-700 shadow-sm border border-[#e2dcce]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>🔮</span> {lang === 'zh' ? '描述宿命之契' : lang === 'ja' ? 'キャラクター叙事' : 'Narrative Sync'}
          </button>
        </div>

        <div className="p-4 md:p-5 space-y-4 md:space-y-5 md:flex-1 overflow-visible md:overflow-y-auto">
          
          {/* TAB 1: GEOGRAPHICAL BARRIER GENERATOR */}
          {activeTab === 'map' ? (
            <div className="space-y-5">
              <section className="bg-white p-4 rounded-xl border border-[#ede9df] shadow-sm relative">
                <div className="absolute top-2 right-2 text-rose-800/10 text-2xl select-none">⛩</div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-rose-600" />
                  {t.geoRange}
                </h3>
                
                {/* Scrollable list of refined countries / presets */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button 
                    onClick={() => setGeoRange('national')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'national' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">🇯🇵</span> {t.geoNational}
                  </button>

                  <button 
                    onClick={() => setGeoRange('kanto')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'kanto' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">🍁</span> {t.geoKanto}
                  </button>

                  <button 
                    onClick={() => setGeoRange('china')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'china' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">🇨🇳</span> {t.geoChina}
                  </button>

                  <button 
                    onClick={() => setGeoRange('europe')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'europe' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">🏰</span> {t.geoEurope}
                  </button>

                  <button 
                    onClick={() => setGeoRange('america')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'america' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">🦅</span> {t.geoAmerica}
                  </button>

                  <button 
                    onClick={() => setGeoRange('custom')}
                    disabled={loading}
                    className={`w-full text-left flex items-center p-2 rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${geoRange === 'custom' ? 'border-rose-200 bg-rose-50/70 text-rose-900 font-bold' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">☯</span> {t.geoCustom}
                  </button>
                </div>
              </section>

              <section className="bg-white p-4 rounded-xl border border-[#ede9df] shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-400 tracking-widest mb-2 uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  {t.stylePreset}
                </h3>
                <select 
                  value={characterStyle}
                  onChange={(e) => setCharacterStyle(e.target.value as any)}
                  disabled={loading}
                  className="w-full p-2.5 bg-[#faf9f5] border border-[#e3ded4] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-rose-400 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="shrine">{t.styleShrine}</option>
                  <option value="academic">{t.styleAcademic}</option>
                  <option value="noble">{t.styleNoble}</option>
                  <option value="historical">{t.styleHistorical}</option>
                  <option value="yokai">{t.styleYokai}</option>
                  <option value="ghost">{t.styleGhost}</option>
                  <option value="celestial">{t.styleCelestial}</option>
                  <option value="modern">{t.styleModern}</option>
                </select>
              </section>

              <button 
                onClick={handleRandomGenerate}
                disabled={loading}
                className="w-full py-4 bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-200/50 hover:bg-rose-800 transition-all flex items-center justify-center gap-2 tracking-widest select-none cursor-pointer border-t border-rose-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:border-slate-200 disabled:cursor-not-allowed"
              >
                <Compass className="w-4 h-4" />
                <span>{t.btnRandom}</span>
              </button>
            </div>
          ) : (
            
            // TAB 2: NARRATIVE FATE RESONANCE GENERATOR (NEW FEATURE)
            <div className="space-y-4">
              <section className="bg-white p-4 rounded-xl border border-[#ede9df] shadow-sm relative">
                <div className="absolute top-2 right-2 text-rose-800/15 text-xl">🔮</div>
                <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-rose-600" />
                  {t.descLabel}
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="w-full h-24 p-3 bg-[#faf9f5] border border-[#e3ded4] rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none font-sans leading-relaxed resize-none disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={t.descPlaceholder}
                />
              </section>

              <section className="bg-white p-4 rounded-xl border border-[#ede9df] shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-400 tracking-widest mb-2 uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  {t.stylePreset}
                </h3>
                <select 
                  value={characterStyle}
                  onChange={(e) => setCharacterStyle(e.target.value as any)}
                  disabled={loading}
                  className="w-full p-2.5 bg-[#faf9f5] border border-[#e3ded4] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-rose-400 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="shrine">{t.styleShrine}</option>
                  <option value="academic">{t.styleAcademic}</option>
                  <option value="noble">{t.styleNoble}</option>
                  <option value="historical">{t.styleHistorical}</option>
                  <option value="yokai">{t.styleYokai}</option>
                  <option value="ghost">{t.styleGhost}</option>
                  <option value="celestial">{t.styleCelestial}</option>
                  <option value="modern">{t.styleModern}</option>
                </select>
              </section>

              <section className="bg-white p-4 rounded-xl border border-[#ede9df] shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-400 tracking-widest mb-2 uppercase flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-rose-600" />
                  {lang === 'zh' ? '地理依附灵脉' : lang === 'ja' ? '地理的依託霊脈' : 'Geographical Anchor'}
                </h3>
                <div className="flex gap-2">
                  <select 
                    value={geoRange}
                    onChange={(e) => setGeoRange(e.target.value as any)}
                    disabled={loading}
                    className="flex-1 p-2 bg-[#faf9f5] border border-[#e3ded4] rounded-lg text-xs text-slate-800 focus:outline-none font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="national">{t.geoNational}</option>
                    <option value="kanto">{t.geoKanto}</option>
                    <option value="china">{t.geoChina}</option>
                    <option value="europe">{t.geoEurope}</option>
                    <option value="america">{t.geoAmerica}</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  {placeInfo 
                    ? `已锚定当前地图：${placeInfo.name}`
                    : '未点击地图时，博丽大结界将自动提供上述预置区域的自然灵威'}
                </p>
              </section>

              <button 
                onClick={triggerDescriptionResonance}
                disabled={loading}
                className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-200/50 transition-all flex items-center justify-center gap-2 tracking-widest select-none cursor-pointer border-t border-amber-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:border-slate-200 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{t.btnDescSync}</span>
              </button>
            </div>
          )}

        </div>

        {/* Nearby public ema notes */}
        <section className="border-t border-[#e9e4d9] bg-[#fbf8f0] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-rose-700" />
                {t.emaNearbyTitle}
              </h3>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">{t.emaNearbyDesc}</p>
            </div>
            <span className="rounded-full border border-rose-100 bg-white px-2 py-1 text-[10px] font-black text-rose-700">
              {nearbyNotes.length}
            </span>
          </div>

          <label className="mt-3 block">
            <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#7c2d12]">
              {t.emaRadiusLabel}
              <strong>{nearbyRadiusKm}km</strong>
            </span>
            <input
              type="range"
              min={10}
              max={300}
              step={10}
              value={nearbyRadiusKm}
              onChange={(event) => setNearbyRadiusKm(Number(event.target.value))}
              className="mt-2 w-full accent-rose-700"
            />
          </label>

          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
            {nearbyLoading ? (
              <div className="rounded-xl border border-dashed border-[#eadfca] bg-white/60 p-3 text-xs font-bold text-slate-500">
                {t.emaNearbyLoading}
              </div>
            ) : nearbyNotes.length > 0 ? (
              nearbyNotes.map((note) => (
                <EmaNoteCard key={note.id} note={note} lang={lang} compact onSelect={setSelectedEmaNote} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#eadfca] bg-white/60 p-3 text-xs leading-6 text-slate-500">
                {t.emaNearbyEmpty}
              </div>
            )}
          </div>
        </section>

        {/* Selected coordinates details */}
        {selectedLocation && (
          <div className="p-4 border-t border-[#e9e4d9] bg-[#f7f5ed] shrink-0">
            <div className="bg-[#1e1c18] rounded-xl p-3.5 text-white/90 shadow-inner relative overflow-hidden">
              <div className="absolute right-2 bottom-1 text-white/5 text-4xl font-serif">印</div>
              <p className="text-[9px] text-[#cca56a] font-bold mb-1 tracking-widest uppercase">☯ {t.mapActive}</p>
              <p className="text-[11px] font-mono tracking-tighter">
                LAT: {selectedLocation.lat.toFixed(5)} / LON: {selectedLocation.lng.toFixed(5)}
              </p>
              {placeInfo && (
                <p className="text-[10px] text-slate-400 mt-1 font-sans line-clamp-1">
                  ⛩ {placeInfo.name} ({placeInfo.country})
                </p>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Interactive Map wrapper */}
      <section className="order-1 md:order-2 flex-1 flex flex-col relative min-h-0 h-auto md:h-full">
        
        {/* The map canvas, customized soft parchment style */}
        <div ref={mapContainerRef} className={`w-full h-[56dvh] min-h-[360px] md:h-full md:flex-1 bg-[#eae5dc] ${loading ? 'cursor-wait' : ''}`} />
        {loading && (
          <div className="absolute inset-0 z-[9] bg-[#fffdfa]/25 backdrop-blur-[1px] cursor-wait" />
        )}

        {/* Floating Leyline Search Bar */}
        <div className="absolute top-3 left-3 right-3 md:top-5 md:left-auto md:right-5 z-20 md:w-80 md:max-w-[calc(100vw-40px)]">
          <div className="bg-[#fdfcf9]/95 backdrop-blur-md rounded-xl p-2 shadow-xl border border-[#e3ded4] flex gap-1.5 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) handleSearchSubmit();
              }}
              disabled={loading}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-1 font-sans disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              onClick={handleSearchSubmit}
              disabled={searchingMap || loading}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all select-none cursor-pointer flex items-center gap-1.5 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed shrink-0"
            >
              {searchingMap || loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              )}
              <span>{t.btnSearch}</span>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-1.5 bg-[#fdfcf7] rounded-xl shadow-2xl border border-[#e6decf] divide-y divide-[#ede9df] overflow-hidden max-h-60 overflow-y-auto z-50">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(result)}
                  disabled={loading}
                  className="w-full text-left p-2.5 px-3.5 hover:bg-rose-50 transition-colors cursor-pointer text-xs flex flex-col gap-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="font-bold text-slate-800 truncate block">
                    🏮 {result.display_name.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block font-sans">
                    {result.display_name.split(',').slice(1).join(',')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Elegant Float guidance overlay for Touch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#fdfcf9]/95 backdrop-blur px-5 py-2.5 rounded-full shadow-lg border border-[#e3ded4] hidden lg:flex items-center gap-2 pointer-events-none z-10 select-none">
          <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span className="font-bold text-[11px] tracking-widest text-[#5c4a37]">{t.tipClickMap}</span>
        </div>

        {/* BOTTOM ACTIVE RESULT PANEL */}
        {(selectedLocation || loading) && (
          <div className="relative md:absolute md:bottom-6 md:left-8 md:right-8 m-3 md:m-0 bg-[#fdfcf7] hover:bg-[#fffffb] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl border-2 border-[#e6decf] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 md:gap-5 z-10 transition-all duration-300 max-h-none md:max-h-[70vh] overflow-visible md:overflow-y-auto">
            
            {/* Sakura blossom corner decorations */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-400 to-transparent pointer-events-none" />
            
            {loading ? (
              <PrayerLoading
                title={t.prayerLoadingTitle}
                message={activeTab === 'desc' ? t.descTuning : t.loadingText}
                hint={t.prayerLoadingHint}
              />
            ) : generatedName ? (
              <>
                <div className="flex-1 space-y-2">
                  {/* Fated Backtrack Timeline */}
                  {generationHistory.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 pb-2.5 mb-2 border-b border-[#e6decf]">
                      <span className="text-[10px] text-[#7c2d12] font-black uppercase tracking-wider font-serif flex items-center gap-1">
                        🔮 {t.backtrackLabel}:
                      </span>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          disabled={historyIndex <= 0}
                          onClick={handleBacktrackPrev}
                          className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#eae5da] disabled:opacity-30 disabled:hover:bg-[#FAF8F5] rounded-lg text-[10px] font-bold text-[#5c4a37] border border-[#e3ded4] transition-colors cursor-pointer select-none flex items-center gap-1"
                          title={t.backtrackPrev}
                        >
                          {t.backtrackPrev}
                        </button>
                        <span className="text-[10px] font-mono text-[#5c4a37] select-none font-bold px-1.5 bg-[#f5f2eb] rounded border border-[#e3ded4]">
                          {historyIndex + 1} / {generationHistory.length}
                        </span>
                        <button
                          disabled={historyIndex >= generationHistory.length - 1}
                          onClick={handleBacktrackNext}
                          className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#eae5da] disabled:opacity-30 disabled:hover:bg-[#FAF8F5] rounded-lg text-[10px] font-bold text-[#5c4a37] border border-[#e3ded4] transition-colors cursor-pointer select-none flex items-center gap-1"
                          title={t.backtrackNext}
                        >
                          {t.backtrackNext}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    
                    {/* Native localized display */}
                    <h2 className="text-xl md:text-3xl font-serif font-black tracking-tight text-slate-800">
                      {lang === 'zh' 
                        ? (generatedName.fullName_zh || generatedName.fullName) 
                        : lang === 'ja'
                        ? (generatedName.fullName_ja || generatedName.fullName)
                        : (generatedName.fullName_en ||  generatedName.fullName)}
                    </h2>

                    {/* Secondary localization helper */}
                    <span className="text-xs font-semibold text-rose-700 tracking-wide bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50">
                      {lang === 'zh'
                        ? (generatedName.fullName_ja || generatedName.fullName)
                        : (generatedName.fullName_zh || `${generatedName.lastName_zh || ''}${generatedName.firstName_zh || ''}`)}
                    </span>

                    {/* Romaji text rendering - ALWAYS ATTACHED to generated names */}
                    {generatedName.fullName_romaji && (
                      <span className="text-[11px] text-amber-800 font-mono tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        romaji: {generatedName.fullName_romaji}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
                      📍 {t.originLabel}: {lang === 'zh' 
                        ? (generatedName.placeName_zh || generatedName.placeName)
                        : lang === 'ja'
                        ? (generatedName.placeName_ja || generatedName.placeName)
                        : (generatedName.placeName_en || generatedName.placeName)}
                      {` (${lang === 'zh' ? (generatedName.country_zh || generatedName.country) : lang === 'ja' ? (generatedName.country_ja || '海外') : (generatedName.country_en || 'Overseas')})`}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-100">
                      🌟 {t.typeLabel}: {lang === 'zh' 
                        ? (generatedName.characterArchetype_zh || generatedName.characterArchetype)
                        : lang === 'ja'
                        ? (generatedName.characterArchetype_ja || generatedName.characterArchetype)
                        : (generatedName.characterArchetype_en || generatedName.characterArchetype)}
                    </span>
                  </div>

                  {/* Poetic inspiration */}
                  <p className="text-[11px] md:text-xs text-slate-600 italic bg-[#FAF8F5] p-3 rounded-xl border border-[#eae5da] leading-relaxed font-sans mt-2">
                    ✍️ <strong className="font-serif not-italic text-[#7c2d12]">{t.inspirationLabel}:</strong> {lang === 'zh' 
                      ? (generatedName.inspiration_zh || generatedName.inspiration)
                      : lang === 'ja'
                      ? (generatedName.inspiration_ja || generatedName.inspiration)
                      : (generatedName.inspiration_en || generatedName.inspiration)}
                  </p>
                </div>
                
                <div className="flex xl:flex-col gap-2 shrink-0 self-stretch xl:self-auto justify-end">
                   <button 
                     onClick={() => {
                       onSave(generatedName);
                       if (generatedName.lat === undefined || generatedName.lng === undefined) {
                         alert(`${t.alertSaved}\n${t.emaNoLocation}`);
                         return;
                       }
                       setPublishEntry(generatedName);
                       setPublishDialogOpen(true);
                     }}
                     className="px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer select-none border-t border-rose-500 w-full text-center"
                   >
                     {t.btnAddCollection}
                   </button>
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-sm italic">
                {lang === 'zh' ? '博丽法阵运转就绪。请在大结界中点选灵脉以幻化神名...' : 'Great Barrier array is online. Pin spatial nodes or invoke narrative sync above...'}
              </div>
            )}
          </div>
        )}
      </section>

      {selectedEmaNote && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#241711]/50 p-3 backdrop-blur-sm md:items-center md:p-6">
          <div className="my-6 w-full max-w-2xl">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmaNote(null)}
                className="rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-black text-rose-700 shadow-sm cursor-pointer"
              >
                {t.emaCloseNote}
              </button>
            </div>
            <EmaNoteCard note={selectedEmaNote} lang={lang} />
          </div>
        </div>
      )}

      <EmaPublishDialog
        open={publishDialogOpen}
        entry={publishEntry}
        lang={lang}
        radiusKm={nearbyRadiusKm}
        onClose={() => setPublishDialogOpen(false)}
        onPublished={(note) => {
          setNearbyNotes((prev) => [note, ...prev.filter((item) => item.id !== note.id)]);
        }}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { cn } from '../../lib/utils';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  zoom?: number;
  readOnly?: boolean;
}

function LocationMarker({ lat, lng, onChange, readOnly }: { lat: number; lng: number; onChange?: (lat: number, lng: number) => void, readOnly?: boolean }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (readOnly || !onChange) return;
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return lat !== 0 ? (
    <Marker 
      position={[lat, lng]} 
      draggable={!readOnly} 
      eventHandlers={{
        dragend: (e) => {
          if (readOnly || !onChange) return;
          const marker = e.target;
          const position = marker.getLatLng();
          onChange(position.lat, position.lng);
        }
      }} 
    />
  ) : null;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange, zoom = 13, readOnly = false }: LocationPickerProps) {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);

  // Default to India center if 0,0
  const center: [number, number] = lat !== 0 ? [lat, lng] : [20.5937, 78.9629];

  const handleLocateMe = () => {
    if (readOnly) return;
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange?.(position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(t('map.location_access_denied'));
          setIsLocating(false);
        }
      );
    } else {
      alert(t('map.geolocation_not_supported'));
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" />
          {readOnly ? t('farm_location') || 'Farm Location' : t('map.select_location_map')}
        </label>
        {!readOnly && (
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm"
          >
            {isLocating ? (
              <Navigation className="w-3 h-3 animate-pulse" />
            ) : (
              <LocateFixed className="w-3 h-3" />
            )}
            {t('map.locate_me')}
          </button>
        )}
      </div>

      <div className={cn(
        "h-[350px] w-full rounded-[2rem] overflow-hidden border relative z-0 transition-all duration-300",
        readOnly ? "border-slate-100 shadow-sm" : "border-slate-200 shadow-xl"
      )}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={!readOnly}
          touchZoom={!readOnly}
          doubleClickZoom={!readOnly}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker lat={lat} lng={lng} onChange={onChange} readOnly={readOnly} />
          <ChangeView center={center} zoom={zoom} />
        </MapContainer>
        
        {lat === 0 && !readOnly && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[1000] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white animate-bounce">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                </div>
                {t('map.click_map_to_set')}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">{t('map.lat')}</p>
          <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 shadow-sm">
            {lat.toFixed(6)}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">{t('map.lng')}</p>
          <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 shadow-sm">
            {lng.toFixed(6)}
          </div>
        </div>
      </div>
    </div>
  );
}
